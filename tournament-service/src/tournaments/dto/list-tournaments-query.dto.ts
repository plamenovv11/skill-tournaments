import { IsOptional, IsString } from 'class-validator';

export class ListTournamentsQueryDto {
    @IsOptional()
    @IsString()
    gameType?: string;

    @IsOptional()
    @IsString()
    tournamentType?: string;

    @IsOptional()
    @IsString()
    status?: string;
}
