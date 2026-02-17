import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { TournamentsRepository } from './tournaments.repository';
import { Tournament } from './entities/tournament.entity';
import { TournamentPlayer } from './entities/tournament-player.entity';
import { NatsModule } from '../nats/nats.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Tournament, TournamentPlayer]),
        NatsModule,
    ],
    controllers: [TournamentsController],
    providers: [TournamentsService, TournamentsRepository],
})
export class TournamentsModule { }
