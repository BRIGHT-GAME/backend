import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn} from 'typeorm';
import {IUser} from "../interfaces/IUser";
import {InventoryEntity} from "../../inventory/entity/inventory.entity";
import {ItemEntity} from "../../items/entity/item.entity";
import { CharacterClass } from '../enums/character-class.enum';
import { UserTasksEntity } from './user-tasks.entity';


@Entity()
export class UserEntity implements IUser{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  walletAddress: string;

  @Column({ nullable: true })
  nonce: string;

  @Column({ nullable: true })
  username: string;

  @Column({ default: 80 })
  energyCurrent: number;

  @Column({ default: 80 })
  energyMax: number;

  @Column({ default: 0 })
  gameCoins: number;

  @Column({ default: 0 })
  score: number;

  @Column({default: 0})
  level: number;

  @Column({default:0})
  levelInd:number;

  @Column({nullable: true ,default:1})
  equippedSkinId?: number;

  @ManyToOne(() => ItemEntity, { nullable: true })
  @JoinColumn({ name: 'equippedSkinId' })
  equippedSkin?: ItemEntity;

  @OneToMany(() => InventoryEntity, inv => inv.user)
  inventory: InventoryEntity[];

  @Column({
    type: 'enum',
    enum: CharacterClass,
    nullable: true,
  })
  characterClass?: CharacterClass; 

  @OneToMany(() => UserTasksEntity, (userTasks) => userTasks.user)
  tasks: UserTasksEntity[];

  @Column({ nullable: true })
  nextCaseTS?: number;
}
