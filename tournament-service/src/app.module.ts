import { Module } from '@nestjs/common';
import { TournamentsModule } from './tournaments/tournaments.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [DatabaseModule, TournamentsModule],
})
export class AppModule { }
