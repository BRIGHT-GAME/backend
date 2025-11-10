import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    ManyToOne, 
    PrimaryGeneratedColumn
} from "typeorm";
import { UserEntity } from "./user.entity";


//TODO: установить стринги для кейсов
export enum ECaseType {
    energy_10 = '10_energy',
    energy_30 = '30_energy',
    energy_50 = '50_energy',
    coins_100 = '100_coins',
    coins_250 = '250_coins',
    coins_500 = '500_coins',
    gold_mask = 'gold_mask',
    gold_mask_repeat = 'gold_mask_repeat',
}

@Entity('case_history')
export class CaseHistoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => UserEntity)
    user: UserEntity;

    @Column({
        type: 'enum',
        enum: ECaseType,
        nullable: true,
      })
    caseType?: ECaseType; 

    @Column({
        type: 'boolean',
        default: false,
      })
    isDaily: boolean; 

    @CreateDateColumn()
    createdAt: Date;
}