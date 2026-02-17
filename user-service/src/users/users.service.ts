import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { User } from './models/user.model';

interface AuthUserResponse {
    valid: boolean;
    user?: User; error?: string
};

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(private readonly usersRepository: UsersRepository) { }

    getUser(userId: string): User | null {
        this.logger.log(`Getting user info for: ${userId}`);
        const user = this.usersRepository.findById(userId);

        if (!user) {
            this.logger.warn(`User not found: ${userId}`);
            return null;
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
    }

    async authenticateUser(email: string, password: string): Promise<AuthUserResponse> {
        this.logger.log(`Authenticating user: ${email}`);
        const user = this.usersRepository.findByEmail(email);

        if (!user) {
            return { valid: false, error: 'Invalid email or password' };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return { valid: false, error: 'Invalid email or password' };
        }

        const { password: _, ...userWithoutPassword } = user;
        return { valid: true, user: userWithoutPassword as User };
    }

    validateUserBalance(userId: string, requiredAmount: number): AuthUserResponse {
        const user = this.usersRepository.findById(userId);

        if (!user) {
            return { valid: false, error: `User not found: ${userId}` };
        }

        if (user.balance < requiredAmount) {
            return {
                valid: false,
                user,
                error: `Insufficient balance. Required: ${requiredAmount}, Available: ${user.balance}`,
            };
        }

        return { valid: true, user };
    }

    getAllUsers(): User[] {
        const users = this.usersRepository.findAll();
        return users.map(({ password, ...user }) => user as User);
    }
}
