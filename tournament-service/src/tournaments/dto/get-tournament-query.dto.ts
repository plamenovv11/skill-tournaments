import { IsString, IsNotEmpty } from 'class-validator';

export class GetTournamentQueryDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}
