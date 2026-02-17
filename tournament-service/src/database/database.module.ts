import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from '../tournaments/entities/tournament.entity';
import { TournamentPlayer } from '../tournaments/entities/tournament-player.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST || 'localhost',
            port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
            username: process.env.POSTGRES_USER || 'postgres',
            password: process.env.POSTGRES_PASSWORD || 'postgres',
            database: process.env.POSTGRES_DB || 'tournaments',
            entities: [Tournament, TournamentPlayer],
            synchronize: true,
            logging: process.env.NODE_ENV !== 'production',
        }),
    ],
})
export class DatabaseModule { }
