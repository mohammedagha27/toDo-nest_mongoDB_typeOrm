import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TASK_REPOSITORY } from 'src/common/constants';
import { Repository } from 'typeorm';
import { TasksDTO } from './dto/create-task.dto';
import { PageInfoQueryDTO } from './dto/pageInfo.dto';
import { Task } from './task.entity';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class TasksService {
  constructor(
    @Inject(TASK_REPOSITORY) private tasksRepository: Repository<Task>,
  ) {}

  async createTask(TasksDTO: TasksDTO, user_id: string): Promise<any> {
    const { title } = TasksDTO;
    const task = {
      task_id: uuidv4(),
      status: 'todo',
      title,
      user_id,
    };
    return await (
      await this.tasksRepository.insert(task)
    ).raw.ops[0];
  }

  async findAll(
    user_id: string,
    pageInfoQueryDTO: PageInfoQueryDTO,
  ): Promise<any> {
    const { offset, limit } = pageInfoQueryDTO;

    const data = await this.tasksRepository.find({
      where: { user_id },
      take: limit,
      skip: offset,
    });
    return data;
  }

  async deleteTask(task_id: string, user_id: string): Promise<void> {
    const task = await this.findTaskByID(task_id);
    await this.checkTaskOwner(task, user_id);
    await this.tasksRepository.delete({ task_id });
    return;
  }

  async updateTaskTitle(task_id: string, user_id: string, title: string) {
    const task = await this.findTaskByID(task_id);
    await this.checkTaskOwner(task, user_id);
    if (!title) throw new BadRequestException('title must not be empty');
    const updatedTask = await this.tasksRepository.update(
      { task_id },
      { title },
    );
    return updatedTask;
  }

  async findSingleTask(id: string, userId: string) {
    const task = await this.findTaskByID(id);
    await this.checkTaskOwner(task, userId);
    return task;
  }
  async markAsDone(task_id: string, user_id: string) {
    const task = await this.findTaskByID(task_id);
    await this.checkTaskOwner(task, user_id);
    const updatedTask = await this.tasksRepository.update(
      { task_id },
      { status: 'done' },
    );
    return updatedTask;
  }

  async findTaskByID(id: string) {
    const task = await this.tasksRepository.findOne({
      where: { task_id: id },
    });
    if (!task) throw new NotFoundException('task not found');
    return task;
  }

  async checkTaskOwner(task: Task, userId: string) {
    if (task.user_id !== userId) throw new ForbiddenException();
    return task;
  }
}
