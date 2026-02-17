import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { Tournament } from './tournament.entity';

export enum PlayerStatus {
    ACTIVE = 'ACTIVE',
    DISQUALIFIED = 'DISQUALIFIED',
}

@Entity('tournament_players')
export class TournamentPlayer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tournamentId: string;

    @ManyToOne(() => Tournament, (tournament) => tournament.players, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'tournamentId' })
    tournament: Tournament;

    @Column()
    playerId: string;

    @Column({ nullable: true })
    playerName: string;

    @CreateDateColumn()
    joinedAt: Date;

    @Column({
        type: 'enum',
        enum: PlayerStatus,
        default: PlayerStatus.ACTIVE,
    })
    status: PlayerStatus;
}
