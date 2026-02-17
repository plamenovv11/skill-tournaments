import {
    Controller,
    Post,
    Get,
    Body,
    Query,
    Param,
    HttpException,
    HttpStatus,
    Logger,
    UseGuards,
    Req,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { JoinTournamentDto } from './dto/join-tournament.dto';
import { GetTournamentsDto } from './dto/get-tournaments.dto';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@Controller('tournaments')
export class TournamentsController {
    private readonly logger = new Logger(TournamentsController.name);

    constructor(private readonly tournamentsService: TournamentsService) { }

    @Post()
    async createTournament(@Body() dto: CreateTournamentDto) {
        this.logger.log(`POST /tournaments - ${dto.gameType}/${dto.tournamentType}/$${dto.entryFee}`);

        try {
            const result = await this.tournamentsService.createTournament(
                dto.gameType,
                dto.tournamentType,
                dto.entryFee,
            );

            if (!result.success) {
                throw new HttpException(
                    result.error || 'Failed to create tournament',
                    HttpStatus.BAD_REQUEST,
                );
            }

            return result;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            this.logger.error(`Error creating tournament: ${error.message}`);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    async listTournaments(
        @Query('gameType') gameType?: string,
        @Query('tournamentType') tournamentType?: string,
        @Query('status') status?: string,
    ) {
        this.logger.log(`GET /tournaments`);

        try {
            const result = await this.tournamentsService.listTournaments({
                gameType,
                tournamentType,
                status,
            });

            if (!result.success) {
                throw new HttpException(
                    result.error || 'Failed to list tournaments',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            return result;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            this.logger.error(`Error listing tournaments: ${error.message}`);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('my-tournaments')
    @UseGuards(OptionalJwtAuthGuard)
    async getMyTournaments(@Query() query: GetTournamentsDto, @Req() req: any) {
        const playerId = req.user?.playerId || query.playerId;

        if (!playerId) {
            throw new HttpException(
                'playerId is required (provide as query param or use JWT authentication)',
                HttpStatus.BAD_REQUEST,
            );
        }

        this.logger.log(`GET /tournaments/my-tournaments - playerId: ${playerId}`);

        try {
            const result = await this.tournamentsService.getMyTournaments(playerId);

            if (!result.success) {
                throw new HttpException(
                    result.error || 'Failed to get tournaments',
                    HttpStatus.NOT_FOUND,
                );
            }

            return result;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            this.logger.error(`Error getting tournaments: ${error.message}`);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async getTournament(@Param('id') id: string) {
        this.logger.log(`GET /tournaments/${id}`);

        try {
            const result = await this.tournamentsService.getTournament(id);

            if (!result.success) {
                throw new HttpException(
                    result.error || 'Tournament not found',
                    HttpStatus.NOT_FOUND,
                );
            }

            return result;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            this.logger.error(`Error getting tournament: ${error.message}`);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('join')
    @UseGuards(OptionalJwtAuthGuard)
    async joinTournament(@Body() dto: JoinTournamentDto, @Req() req: any) {
        const playerId = req.user?.playerId || dto.playerId;

        if (!playerId) {
            throw new HttpException(
                'playerId is required (provide in body or use JWT authentication)',
                HttpStatus.BAD_REQUEST,
            );
        }

        this.logger.log(`POST /tournaments/join - playerId: ${playerId}, tournamentId: ${dto.tournamentId}`);

        try {
            const result = await this.tournamentsService.joinTournament(
                playerId,
                dto.tournamentId,
            );

            if (!result.success) {
                throw new HttpException(
                    result.error || 'Failed to join tournament',
                    HttpStatus.BAD_REQUEST,
                );
            }

            return result;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            this.logger.error(`Error joining tournament: ${error.message}`);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
