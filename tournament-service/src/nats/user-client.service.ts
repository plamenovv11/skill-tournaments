import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

export interface UserInfo {
    id: string;
    name: string;
    email: string;
    balance: number;
}

export interface UserValidation {
    valid: boolean;
    user?: UserInfo;
    error?: string;
}

@Injectable()
export class UserClientService {
    private readonly logger = new Logger(UserClientService.name);

    constructor(@Inject('NATS_SERVICE') private readonly natsClient: ClientProxy) { }

    async getUser(userId: string): Promise<UserInfo | null> {
        this.logger.log(`Requesting user info via NATS for: ${userId}`);
        try {
            const response = await firstValueFrom(
                this.natsClient
                    .send('user.get', { userId })
                    .pipe(timeout(5000)),
            );

            if (!response.success) {
                this.logger.warn(`User not found via NATS: ${userId}`);
                return null;
            }

            return response.data;
        } catch (error) {
            this.logger.error(`Failed to get user info via NATS: ${error.message}`);
            throw new Error(`User service unavailable: ${error.message}`);
        }
    }

    async validateUserBalance(
        userId: string,
        requiredAmount: number,
    ): Promise<UserValidation> {
        this.logger.log(
            `Validating user balance via NATS - userId: ${userId}, amount: ${requiredAmount}`,
        );
        try {
            const response = await firstValueFrom(
                this.natsClient
                    .send('user.validate', { userId, requiredAmount })
                    .pipe(timeout(5000)),
            );

            return response;
        } catch (error) {
            this.logger.error(
                `Failed to validate user balance via NATS: ${error.message}`,
            );
            throw new Error(`User service unavailable: ${error.message}`);
        }
    }
}
