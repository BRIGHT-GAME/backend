import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { TaskEntity } from 'src/modules/task/task.entity';

@Entity('user_tasks')
export class UserTasksEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.tasks)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => TaskEntity, (task) => task.users)
  @JoinColumn({ name: 'taskId' })
  task: TaskEntity;

  @Column()
  taskId: number;

  @Column()
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}