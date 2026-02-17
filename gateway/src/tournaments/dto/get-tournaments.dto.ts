import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GetTournamentsDto {
    @IsString()
    @IsOptional()
    playerId?: string; // Optional if JWT auth is used
}
