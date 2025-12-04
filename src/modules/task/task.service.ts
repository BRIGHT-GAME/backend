import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
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
    @Inject(forwardRef(() => UserService))
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

    return this.executeTask(user, task);
  }

  async completeTaskByCondition(userId: number, condition: string): Promise<UserDto | null> {
    const task = await this.taskRepo.findOne({ where: { condition } });
    if (!task) {
      return null;
    }

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userTasks = await this.userTaskRepo.find({ where: { userId, taskId: task.id } });
    if (userTasks.length > 0) {
      return null;
    }

    return this.executeTask(user, task);
  }

  private async executeTask(user: UserEntity, task: TaskEntity): Promise<UserDto> {
    const completedTask = this.userTaskRepo.create({
      userId: user.id,
      taskId: task.id,
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

  async checkAndCompleteGamesTasks(userId: number, gamesCount: number): Promise<void> {
    const taskConditionsMap: Record<string, number> = {
      firstgame: 1,
      tengames: 10,
      fiftygames: 50,
      hundredgames: 100,
      threehundredgames: 300,
      fivehundredgames: 500,
    };

    for (const [condition, requiredGames] of Object.entries(taskConditionsMap)) {
      if (gamesCount >= requiredGames) {
        await this.completeTaskByCondition(userId, condition);
      }
    }
  }
}