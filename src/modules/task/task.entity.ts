import { Entity, Column, PrimaryGeneratedColumn, OneToMany, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { UserTasksEntity } from '../users/entity/user-tasks.entity';

export enum EValueType {
  ENERGY = 'energy',
  COINS = 'coins'
}
@Entity('task')
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  link: string;

  @Column()
  condition: string;

  @Column()
  value: number; 

  @Column({
    type: 'enum',
    enum: EValueType,
  })
  valueType: EValueType;

  @OneToMany(() => UserTasksEntity, (userTasks) => userTasks.task)
  users: UserTasksEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;  
}