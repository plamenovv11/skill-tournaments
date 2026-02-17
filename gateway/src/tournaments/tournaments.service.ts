import { Injectable, Logger } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class TournamentsService {
    private readonly logger = new Logger(TournamentsService.name);

    constructor(private readonly kafkaService: KafkaService) { }

    async createTournament(gameType: string, tournamentType: string, entryFee: number) {
        this.logger.log(`Sending create tournament command via Kafka`);
        return this.kafkaService.sendCommand<any>('tournament.command.create', {
            gameType,
            tournamentType,
            entryFee,
        });
    }

    async joinTournament(playerId: string, tournamentId: string) {
        this.logger.log(`Sending join tournament command via Kafka for player: ${playerId}`);
        return this.kafkaService.sendCommand<any>('tournament.command.join', {
            playerId,
            tournamentId,
        });
    }

    async getTournament(id: string) {
        this.logger.log(`Sending get tournament query via Kafka for id: ${id}`);
        return this.kafkaService.sendCommand<any>('tournament.query.get', { id });
    }

    async listTournaments(filters?: { gameType?: string; tournamentType?: string; status?: string }) {
        this.logger.log(`Sending list tournaments query via Kafka`);
        return this.kafkaService.sendCommand<any>('tournament.query.list', filters || {});
    }

    async getMyTournaments(playerId: string) {
        this.logger.log(`Sending get-my-tournaments query via Kafka for player: ${playerId}`);
        return this.kafkaService.sendCommand<any>('tournament.query.my-tournaments', { playerId });
    }
}
