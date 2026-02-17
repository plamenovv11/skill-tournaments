import { IsString, IsNotEmpty } from 'class-validator';

export class JoinTournamentCommandDto {
    @IsString()
    @IsNotEmpty()
    playerId: string;

    @IsString()
    @IsNotEmpty()
    tournamentId: string;
}
