import { Injectable, OnModuleInit, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class KafkaService implements OnModuleInit {
    private readonly logger = new Logger(KafkaService.name);

    constructor(
        @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    ) { }

    async onModuleInit() {
        this.kafkaClient.subscribeToResponseOf('tournament.command.create');
        this.kafkaClient.subscribeToResponseOf('tournament.command.join');
        this.kafkaClient.subscribeToResponseOf('tournament.query.get');
        this.kafkaClient.subscribeToResponseOf('tournament.query.list');
        this.kafkaClient.subscribeToResponseOf('tournament.query.my-tournaments');
        await this.kafkaClient.connect();
        this.logger.log('Kafka client connected and subscribed to response topics');
    }

    async sendCommand<T>(topic: string, payload: any): Promise<T> {
        const correlationId = uuidv4();
        this.logger.log(`Sending command to ${topic} | correlationId: ${correlationId}`);

        const message = {
            ...payload,
            correlationId,
            timestamp: Date.now(),
        };

        try {
            const result = await firstValueFrom(
                this.kafkaClient.send(topic, message).pipe(timeout(10000)),
            );
            this.logger.log(`Received response for correlationId: ${correlationId}`);
            return result as T;
        } catch (error) {
            this.logger.error(
                `Timeout or error for correlationId ${correlationId}: ${error.message}`,
            );
            throw error;
        }
    }
}
