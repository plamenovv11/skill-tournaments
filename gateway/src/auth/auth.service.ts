import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NatsService } from '../nats/nats.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly jwtService: JwtService,
        private readonly natsService: NatsService,
    ) { }

    async login(email: string, password: string): Promise<{ accessToken: string; user: any }> {
        this.logger.log(`Authenticating user: ${email}`);

        const result = await this.natsService.authenticateUser(email, password);

        if (!result.success) {
            throw new Error(result.error || 'Invalid credentials');
        }

        const user = result.data;
        const payload = { sub: user.id, playerId: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                balance: user.balance,
            },
        };
    }

    async validateToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            return null;
        }
    }
}
