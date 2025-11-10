import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { IInventory } from '../interfaces/IInventory';
import { UserEntity } from '../../users/entity/user.entity';
import { ItemEntity } from '../../items/entity/item.entity';

@Entity('inventory')
export class InventoryEntity implements IInventory {
  @PrimaryGeneratedColumn()
  id: number;

  // Храним userId/itemId явно в базе,
  // чтобы соответствовать интерфейсу IInventory
  @Column()
  userId: number;

  @Column()
  itemId: number;

  // Связь с UserEntity
  @ManyToOne(() => UserEntity, user => user.inventory, { onDelete: 'CASCADE', onUpdate: "CASCADE" })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  // Связь с ItemEntity
  @ManyToOne(() => ItemEntity, item => item.inventory, { onDelete: 'CASCADE', onUpdate: "CASCADE" })
  @JoinColumn({ name: 'itemId' })
  item: ItemEntity;
}
