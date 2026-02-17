import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class JoinTournamentDto {
    @IsOptional()
    @IsString()
    playerId?: string; // Optional if using JWT auth

    @IsString()
    @IsNotEmpty()
    tournamentId: string;
}
