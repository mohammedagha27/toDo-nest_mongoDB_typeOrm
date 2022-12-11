import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TasksDTO } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { TransactionParam, User } from 'src/common/decorators';
import { Auth } from 'src/common/decorators';
import { ADMIN_ROLE } from 'src/common/constants';
import { PageInfoQueryDTO } from './dto/pageInfo.dto';
import { PageInfoInterceptor } from 'src/common/interceptors/pageInfo.interceptor';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Auth(ADMIN_ROLE)
  @UseInterceptors(PageInfoInterceptor)
  @Get()
  async getAllTasks(
    @User('user_id') userId: string,
    @Query() pageInfoQueryDTO?: PageInfoQueryDTO,
  ) {
    return this.taskService.findAll(userId, pageInfoQueryDTO);
  }

  @Auth(ADMIN_ROLE)
  @Get(':id')
  async getSingleTask(
    @Param('id') taskId: string,
    @User('user_id') userId: string,
  ) {
    return this.taskService.findSingleTask(taskId, userId);
  }

  @Auth(ADMIN_ROLE)
  @Post()
  async addTask(@Body() TasksDTO: TasksDTO, @User('user_id') userId: string) {
    return this.taskService.createTask(TasksDTO, userId);
  }

  @Auth(ADMIN_ROLE)
  @Delete(':id')
  async deleteTask(@Param('id') id: string, @User('user_id') userId: string) {
    return await this.taskService.deleteTask(id, userId);
  }

  @Auth(ADMIN_ROLE)
  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @User('user_id') userId: string,
    @Body('title') title: string,
  ) {
    return await this.taskService.updateTaskTitle(id, userId, title);
  }

  @Auth(ADMIN_ROLE)
  @Patch('/mark-done/:id')
  async markAsDone(@Param('id') id: string, @User('user_id') user_id: string) {
    return await this.taskService.markAsDone(id, user_id);
  }
}
