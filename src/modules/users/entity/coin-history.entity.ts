import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    ManyToOne, 
    PrimaryGeneratedColumn
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('coin_history')
export class CoinHistoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => UserEntity)
    user: UserEntity;

    @Column()
    balance: number;

    @CreateDateColumn()
    createdAt: Date;
}