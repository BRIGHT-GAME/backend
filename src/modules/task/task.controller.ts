import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskEntity } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { UserDto } from '../users/dto/user.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all user tasks (completed tasks are marked with true). if userId is not provided, all tasks will be returned',
    description: 'Get all user tasks',
    tags: ['tasks'],
    responses: {
      '200': {
        description: 'Tasks',
      },
    },
  })
  findAll(@Request() req): Promise<(TaskEntity & { completed?: boolean })[]> {
    const userId = req.user.sub;
    return this.taskService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<TaskEntity | null> {
    return this.taskService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateTaskDto): Promise<TaskEntity> {
    return this.taskService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<TaskEntity>) {
    return this.taskService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.taskService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('complete/:id')
  @ApiOperation({ summary: 'Complete task (side-effect is energy update)',
    description: 'Complete task',
    tags: ['tasks'],
    responses: {
      '200': {
        description: 'Task completed',
      },
    },
   })
  completeTask(@Param('id') id: string, @Request() req: { user: { sub: number } }): Promise<UserDto> {
    const userId = req.user.sub;
    return this.taskService.completeTask(userId, Number(id));
  }
}