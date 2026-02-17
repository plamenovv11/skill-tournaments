import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TournamentsService } from './tournaments.service';

@Controller()
export class TournamentsController {
    private readonly logger = new Logger(TournamentsController.name);

    constructor(private readonly tournamentsService: TournamentsService) { }

    @MessagePattern('tournament.command.create')
    async handleCreateTournament(@Payload() message: any) {
        this.logger.log(`Received Kafka: tournament.command.create`);
        try {
            const result = await this.tournamentsService.createTournament(message.payload || message);
            return { correlationId: message.correlationId, ...result };
        } catch (error) {
            this.logger.error(`Error creating tournament: ${error.message}`);
            return {
                correlationId: message.correlationId,
                success: false,
                error: error.message,
            };
        }
    }

    @MessagePattern('tournament.command.join')
    async handleJoinTournament(@Payload() message: any) {
        this.logger.log(`Received Kafka: tournament.command.join`);
        try {
            const result = await this.tournamentsService.joinTournament(message.payload || message);
            return { correlationId: message.correlationId, ...result };
        } catch (error) {
            this.logger.error(`Error joining tournament: ${error.message}`);
            return {
                correlationId: message.correlationId,
                success: false,
                error: error.message,
            };
        }
    }

    @MessagePattern('tournament.query.get')
    async handleGetTournament(@Payload() message: any) {
        this.logger.log(`Received Kafka: tournament.query.get`);
        try {
            const result = await this.tournamentsService.getTournament(message.payload || message);
            return { correlationId: message.correlationId, ...result };
        } catch (error) {
            this.logger.error(`Error getting tournament: ${error.message}`);
            return {
                correlationId: message.correlationId,
                success: false,
                error: error.message,
            };
        }
    }

    @MessagePattern('tournament.query.list')
    async handleListTournaments(@Payload() message: any) {
        this.logger.log(`Received Kafka: tournament.query.list`);
        try {
            const result = await this.tournamentsService.listTournaments(message.payload || message);
            return { correlationId: message.correlationId, ...result };
        } catch (error) {
            this.logger.error(`Error listing tournaments: ${error.message}`);
            return {
                correlationId: message.correlationId,
                success: false,
                error: error.message,
            };
        }
    }

    @MessagePattern('tournament.query.my-tournaments')
    async handleGetMyTournaments(@Payload() message: any) {
        this.logger.log(`Received Kafka: tournament.query.my-tournaments`);
        try {
            const result = await this.tournamentsService.getMyTournaments(message.payload || message);
            return { correlationId: message.correlationId, ...result };
        } catch (error) {
            this.logger.error(`Error getting my tournaments: ${error.message}`);
            return {
                correlationId: message.correlationId,
                success: false,
                error: error.message,
            };
        }
    }
}
