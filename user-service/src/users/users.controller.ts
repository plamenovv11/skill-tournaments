import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(private readonly usersService: UsersService) { }

    @MessagePattern('user.get')
    handleGetUser(@Payload() data: { userId: string }) {
        this.logger.log(`Received NATS request - user.get for userId: ${data.userId}`);
        const user = this.usersService.getUser(data.userId);

        if (!user) {
            return { success: false, error: `User not found: ${data.userId}` };
        }

        return { success: true, data: user };
    }

    @MessagePattern('user.authenticate')
    async handleAuthenticate(@Payload() data: { email: string; password: string }) {
        this.logger.log(`Received NATS request - user.authenticate for email: ${data.email}`);
        const result = await this.usersService.authenticateUser(data.email, data.password);

        if (!result.valid) {
            return { success: false, error: result.error };
        }

        return { success: true, data: result.user };
    }

    @MessagePattern('user.validate')
    handleValidateUser(
        @Payload() data: { userId: string; requiredAmount: number },
    ) {
        this.logger.log(
            `Received NATS request - user.validate for userId: ${data.userId}, amount: ${data.requiredAmount}`,
        );
        const result = this.usersService.validateUserBalance(
            data.userId,
            data.requiredAmount,
        );

        return result;
    }

    @MessagePattern('user.getAll')
    handleGetAllUsers() {
        this.logger.log('Received NATS request - user.getAll');
        const users = this.usersService.getAllUsers();
        return { success: true, data: users };
    }
}
