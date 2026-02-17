import { Module } from '@nestjs/common';
import { TournamentsModule } from './tournaments/tournaments.module';
import { AuthModule } from './auth/auth.module';
import { KafkaModule } from './kafka/kafka.module';
import { NatsModule } from './nats/nats.module';

@Module({
    imports: [KafkaModule, NatsModule, AuthModule, TournamentsModule],
})
export class AppModule { }
