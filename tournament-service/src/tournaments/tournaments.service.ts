import { Injectable, Logger } from '@nestjs/common';
import { TournamentsRepository } from './tournaments.repository';
import { UserClientService } from '../nats/user-client.service';
import { CreateTournamentCommandDto } from './dto/create-tournament-command.dto';
import { JoinTournamentCommandDto } from './dto/join-tournament-command.dto';
import { GetTournamentsQueryDto } from './dto/get-tournaments-query.dto';
import { ListTournamentsQueryDto } from './dto/list-tournaments-query.dto';
import { GetTournamentQueryDto } from './dto/get-tournament-query.dto';
import { TournamentStatus } from './entities/tournament.entity';

@Injectable()
export class TournamentsService {
    private readonly logger = new Logger(TournamentsService.name);

    constructor(
        private readonly tournamentsRepository: TournamentsRepository,
        private readonly userClientService: UserClientService,
    ) { }

    async createTournament(command: CreateTournamentCommandDto) {
        this.logger.log(
            `Creating tournament: ${command.gameType}/${command.tournamentType}/$${command.entryFee}`,
        );

        const tournament = await this.tournamentsRepository.create(
            command.gameType,
            command.tournamentType,
            command.entryFee,
        );

        return {
            success: true,
            data: {
                id: tournament.id,
                gameType: tournament.gameType,
                tournamentType: tournament.tournamentType,
                entryFee: tournament.entryFee,
                status: tournament.status,
                playerCount: 0,
                createdAt: tournament.createdAt,
            },
        };
    }

    async getTournament(query: GetTournamentQueryDto) {
        this.logger.log(`Getting tournament: ${query.id}`);
        const tournament = await this.tournamentsRepository.findById(query.id);

        if (!tournament) {
            return { success: false, error: `Tournament not found: ${query.id}` };
        }

        return {
            success: true,
            data: {
                id: tournament.id,
                gameType: tournament.gameType,
                tournamentType: tournament.tournamentType,
                entryFee: tournament.entryFee,
                status: tournament.status,
                playerCount: tournament.players?.length || 0,
                players: tournament.players?.map((p) => ({
                    playerId: p.playerId,
                    playerName: p.playerName,
                    joinedAt: p.joinedAt,
                    status: p.status,
                })) || [],
                createdAt: tournament.createdAt,
                updatedAt: tournament.updatedAt,
            },
        };
    }

    async listTournaments(query: ListTournamentsQueryDto) {
        this.logger.log('Listing tournaments with filters');

        const filters: any = {};
        if (query.gameType) filters.gameType = query.gameType;
        if (query.tournamentType) filters.tournamentType = query.tournamentType;
        if (query.status) filters.status = query.status as TournamentStatus;

        const tournaments = await this.tournamentsRepository.findAll(filters);

        return {
            success: true,
            data: tournaments.map((t) => ({
                id: t.id,
                gameType: t.gameType,
                tournamentType: t.tournamentType,
                entryFee: t.entryFee,
                status: t.status,
                playerCount: t.players?.length || 0,
                createdAt: t.createdAt,
                updatedAt: t.updatedAt,
            })),
        };
    }

    async joinTournament(command: JoinTournamentCommandDto) {
        this.logger.log(
            `Processing join tournament: player ${command.playerId} -> tournament ${command.tournamentId}`,
        );

        const tournament = await this.tournamentsRepository.findById(command.tournamentId);

        if (!tournament) {
            return {
                success: false,
                error: `Tournament not found: ${command.tournamentId}`,
            };
        }

        if (tournament.status !== TournamentStatus.OPEN) {
            return {
                success: false,
                error: `Tournament is not open for joining. Current status: ${tournament.status}`,
            };
        }

        const validation = await this.userClientService.validateUserBalance(
            command.playerId,
            tournament.entryFee,
        );

        if (!validation.valid) {
            this.logger.warn(`Validation failed: ${validation.error}`);
            return { success: false, error: validation.error };
        }

        const user = validation.user!;
        this.logger.log(`User validated: ${user.name} (balance: ${user.balance})`);

        const alreadyJoined = await this.tournamentsRepository.isPlayerInTournament(
            tournament.id,
            command.playerId,
        );

        if (alreadyJoined) {
            this.logger.warn(
                `Player ${command.playerId} already in tournament ${tournament.id}`,
            );
            return {
                success: false,
                error: 'Player has already joined this tournament',
            };
        }

        const player = await this.tournamentsRepository.addPlayer(
            tournament.id,
            command.playerId,
            user.name,
        );

        const updatedTournament = await this.tournamentsRepository.findById(tournament.id);

        if (!updatedTournament) {
            return { success: false, error: 'Tournament not found after update' };
        }

        return {
            success: true,
            data: {
                tournamentId: updatedTournament.id,
                gameType: updatedTournament.gameType,
                tournamentType: updatedTournament.tournamentType,
                entryFee: updatedTournament.entryFee,
                status: updatedTournament.status,
                playerCount: updatedTournament.players.length,
                joinedAt: player.joinedAt,
            },
        };
    }

    async getMyTournaments(query: GetTournamentsQueryDto) {
        this.logger.log(
            `Processing get-my-tournaments for player: ${query.playerId}`,
        );

        const user = await this.userClientService.getUser(query.playerId);

        if (!user) {
            return {
                success: false,
                error: `User not found: ${query.playerId}`,
            };
        }

        const tournaments = await this.tournamentsRepository.findByPlayerId(
            query.playerId,
        );

        return {
            success: true,
            data: {
                playerId: query.playerId,
                playerName: user.name,
                tournaments: tournaments.map((t) => ({
                    id: t.id,
                    gameType: t.gameType,
                    tournamentType: t.tournamentType,
                    entryFee: t.entryFee,
                    status: t.status,
                    playerCount: t.players?.length || 0,
                    createdAt: t.createdAt,
                    updatedAt: t.updatedAt,
                })),
            },
        };
    }
}
