import { IsString, IsNotEmpty } from 'class-validator';

export class GetTournamentsQueryDto {
    @IsString()
    @IsNotEmpty()
    playerId: string;
}
