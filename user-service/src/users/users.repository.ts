import { Injectable, Logger } from '@nestjs/common';
import { User } from './models/user.model';

@Injectable()
export class UsersRepository {
    private readonly logger = new Logger(UsersRepository.name);

    private readonly users: User[] = [
        {
            id: 'player-1',
            name: 'Alice Johnson',
            email: 'alice@example.com',
            balance: 1000,
            password: '$2b$10$LhaLirF7mB2Fvvj02E7Pnu4A7TcFzQDTm62rczbC95Qw398haUMo6', // password1
        },
        {
            id: 'player-2',
            name: 'Bob Smith',
            email: 'bob@example.com',
            balance: 500,
            password: '$2b$10$3pu.WoKLzBbP7d0.9AjiPu3quhp91Onz7IEW6AX6qNfE.JSvUkgDu', // password2
        },
        {
            id: 'player-3',
            name: 'Charlie Brown',
            email: 'charlie@example.com',
            balance: 250,
            password: '$2b$10$UVJtqTl39tCf.ILlNiaMI.XHL/Ija2zE2xAkrovZKWztn.rOOCfBu', // password3
        },
        {
            id: 'player-4',
            name: 'Diana Prince',
            email: 'diana@example.com',
            balance: 2000,
            password: '$2b$10$ORivgFY4GH3i7JJbAagVdOzK1lCVQldFDvFX31n8x9Md/NH3VpNTK', // password4
        },
        {
            id: 'player-5',
            name: 'Eve Martinez',
            email: 'eve@example.com',
            balance: 50,
            password: '$2b$10$KscJ3hVMMwKPToQH3nPq6OUIveiWVUsk8KiBgHO5/Huis5YQIN3J.', // password5
        },
    ];

    findById(userId: string): User | undefined {
        this.logger.log(`Looking up user: ${userId}`);
        return this.users.find((user) => user.id === userId);
    }

    findByEmail(email: string): User | undefined {
        this.logger.log(`Looking up user by email: ${email}`);
        return this.users.find((user) => user.email === email);
    }

    findAll(): User[] {
        return this.users;
    }
}
