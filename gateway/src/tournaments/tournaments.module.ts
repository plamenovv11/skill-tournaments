import { Module } from '@nestjs/common';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { KafkaModule } from '../kafka/kafka.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [KafkaModule, AuthModule],
    controllers: [TournamentsController],
    providers: [TournamentsService],
})
export class TournamentsModule { }
