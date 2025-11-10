import { Entity, Column, PrimaryGeneratedColumn, OneToMany, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { UserTasksEntity } from '../users/entity/user-tasks.entity';

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

  @OneToMany(() => UserTasksEntity, (userTasks) => userTasks.task)
  users: UserTasksEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;  
}