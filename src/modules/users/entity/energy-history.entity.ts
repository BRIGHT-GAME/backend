import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    ManyToOne, 
    PrimaryGeneratedColumn
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('energy_history')
export class EnergyHistoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => UserEntity)
    user: UserEntity;

    @Column({ type: 'decimal', precision: 18, scale: 9 })
    solBalance: number;

    @CreateDateColumn()
    createdAt: Date;
}

