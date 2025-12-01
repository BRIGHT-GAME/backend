import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('game_history')
export class GameHistoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => UserEntity)
    user: UserEntity;

    @Column()
    score: number;

    @Column()
    level: number;

    @Column()
    levelInd: number;

    @Column()
    gameCoins: number;

    @CreateDateColumn()
    createdAt: Date;
}

