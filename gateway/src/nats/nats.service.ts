import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class NatsService implements OnModuleInit {
    private readonly logger = new Logger(NatsService.name);

    constructor(
        @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    ) { }

    async onModuleInit() {
        await this.natsClient.connect();
        this.logger.log('Gateway NATS client connected');
    }

    async authenticateUser(email: string, password: string): Promise<any> {
        this.logger.log(`Authenticating user via NATS: ${email}`);
        try {
            const result = await firstValueFrom(
                this.natsClient.send('user.authenticate', { email, password }).pipe(timeout(5000)),
            );
            return result;
        } catch (error) {
            this.logger.error(`Authentication failed via NATS: ${error.message}`);
            throw new Error(`Authentication service unavailable: ${error.message}`);
        }
    }
}
