import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from 'typeorm';
import { IItem } from '../interfaces/IItem';
import { InventoryEntity } from '../../inventory/entity/inventory.entity';

@Entity('items')
export class ItemEntity implements IItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: 0 })
  price: number;

  // Если хотите иметь связь с InventoryEntity (OneToMany)
  @OneToMany(() => InventoryEntity, inv => inv.item)
  inventory?: InventoryEntity[];
}
