import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EValueType, TaskEntity } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserTasksEntity } from '../users/entity/user-tasks.entity';
import { UserEntity } from '../users/entity/user.entity';
import { UserService } from '../users/user.service';
import { UserDto } from '../users/dto/user.dto';

const MAX_ENERGY = 500;

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepo: Repository<TaskEntity>,
    @InjectRepository(UserTasksEntity)
    private userTaskRepo: Repository<UserTasksEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private userService: UserService,
  ) {}

  async findAll(userId?: number): Promise<(TaskEntity & { completed?: boolean })[]> {
    const tasks = await this.taskRepo.find();
    const userTasks = userId ? await this.userTaskRepo.find({ where: { userId } }) : [];

    return tasks.map(task => ({
      ...task,
      completed: userTasks.some(userTask => userTask.taskId === task.id),
    }));
  }

  findOne(id: number) {
    return this.taskRepo.findOneBy({ id });
  }

  create(data: CreateTaskDto) {
    const task = this.taskRepo.create(data);
    return this.taskRepo.save(task);
  }

  update(id: number, data: Partial<TaskEntity>) {
    return this.taskRepo.update(id, data);
  }

  remove(id: number) {
    return this.taskRepo.delete(id);
  }

  async completeTask(userId: number, taskId: number): Promise<UserDto> {
    const task = await this.taskRepo.findOneBy({ id: taskId });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userTasks = await this.userTaskRepo.find({ where: { userId, taskId } });

    if (userTasks.length > 0) {
      throw new ConflictException('User task already completed');
    }

    const completedTask = this.userTaskRepo.create({
      userId,
      taskId,
      completed: true,
    });

    await this.userTaskRepo.save(completedTask);

    if (task.value && task.value > 0) {
      if (task.valueType === EValueType.ENERGY) {
        const newEnergy = Math.min(user.energyCurrent + task.value, user.energyMax, MAX_ENERGY);
        user.energyCurrent = newEnergy;
        await this.userRepo.save(user);
      }
      if (task.valueType === EValueType.COINS) {
        user.gameCoins += task.value;
        await this.userRepo.save(user);
      }
    }
    
    return this.userService.setEnergyAndCoins(user.walletAddress);
  }
}