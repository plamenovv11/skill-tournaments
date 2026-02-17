import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { TournamentPlayer } from './tournament-player.entity';

export enum TournamentStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
}

@Entity('tournaments')
export class Tournament {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    gameType: string;

    @Column()
    tournamentType: string;

    @Column('decimal', { precision: 10, scale: 2 })
    entryFee: number;

    @Column({
        type: 'enum',
        enum: TournamentStatus,
        default: TournamentStatus.OPEN,
    })
    status: TournamentStatus;

    @OneToMany(() => TournamentPlayer, (player) => player.tournament, {
        cascade: true,
        eager: true,
    })
    players: TournamentPlayer[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
