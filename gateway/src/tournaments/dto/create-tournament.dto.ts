import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateTournamentDto {
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
