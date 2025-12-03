import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { UserTasksEntity } from '../users/entity/user-tasks.entity';
import { UserModule } from '../users/user.module';
import { UserEntity } from '../users/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, UserTasksEntity, UserEntity ]), forwardRef(() => UserModule)],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}