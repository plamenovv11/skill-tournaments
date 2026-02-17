import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament, TournamentStatus } from './entities/tournament.entity';
import { TournamentPlayer } from './entities/tournament-player.entity';

@Injectable()
export class TournamentsRepository {
    private readonly logger = new Logger(TournamentsRepository.name);

    constructor(
        @InjectRepository(Tournament)
        private readonly tournamentRepository: Repository<Tournament>,
        @InjectRepository(TournamentPlayer)
        private readonly playerRepository: Repository<TournamentPlayer>,
    ) { }

    async create(
        gameType: string,
        tournamentType: string,
        entryFee: number,
    ): Promise<Tournament> {
        this.logger.log(
            `Creating new tournament for ${gameType}/${tournamentType}/$${entryFee}`,
        );
        const tournament = this.tournamentRepository.create({
            gameType,
            tournamentType,
            entryFee,
            status: TournamentStatus.OPEN,
            players: [],
        });
        return this.tournamentRepository.save(tournament);
    }

    async findAll(filters?: {
        gameType?: string;
        tournamentType?: string;
        status?: TournamentStatus;
    }): Promise<Tournament[]> {
        const where: any = {};
        if (filters?.gameType) where.gameType = filters.gameType;
        if (filters?.tournamentType) where.tournamentType = filters.tournamentType;
        if (filters?.status) where.status = filters.status;

        return this.tournamentRepository.find({
            where: Object.keys(where).length > 0 ? where : undefined,
            relations: ['players'],
            order: { createdAt: 'DESC' },
        });
    }

    async findById(id: string): Promise<Tournament | null> {
        return this.tournamentRepository.findOne({
            where: { id },
            relations: ['players'],
        });
    }

    async findByPlayerId(playerId: string): Promise<Tournament[]> {
        return this.tournamentRepository
            .createQueryBuilder('tournament')
            .innerJoin('tournament.players', 'player', 'player.playerId = :playerId', {
                playerId,
            })
            .leftJoinAndSelect('tournament.players', 'allPlayers')
            .getMany();
    }

    async isPlayerInTournament(
        tournamentId: string,
        playerId: string,
    ): Promise<boolean> {
        const count = await this.playerRepository.count({
            where: { tournamentId, playerId },
        });
        return count > 0;
    }

    async addPlayer(
        tournamentId: string,
        playerId: string,
        playerName?: string,
    ): Promise<TournamentPlayer> {
        const player = this.playerRepository.create({
            tournamentId,
            playerId,
            playerName: playerName || playerId,
        });
        return this.playerRepository.save(player);
    }

    async save(tournament: Tournament): Promise<Tournament> {
        return this.tournamentRepository.save(tournament);
    }
}
