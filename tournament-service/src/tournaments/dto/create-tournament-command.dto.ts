import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateTournamentCommandDto {
    @IsString()
    @IsNotEmpty()
    gameType: string;

    @IsString()
    @IsNotEmpty()
    tournamentType: string;

    @IsNumber()
    @Min(0)
    entryFee: number;
}
