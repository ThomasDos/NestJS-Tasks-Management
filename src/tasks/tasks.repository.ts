import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieve all tasks.
   *
   * @returns List of all tasks in the database.
   */
  async getAllTasks(user: User) {
    return await this.prisma.task.findMany({ where: { userId: user.id } });
  }

  /**
   * Retrieve tasks based on filters.
   *
   * @param filterDto Filters for querying tasks.
   * @returns List of tasks that match the applied filters.
   */
  async getTasksWithFilters(filterDto: GetTasksFilterDto, user: User) {
    const { search, status } = filterDto;
    return await this.prisma.task.findMany({
      where: {
        AND: [
          { userId: user.id },
          {
            OR: [
              {
                status,
              },
              { description: { contains: search } },
              {
                title: { contains: search },
              },
            ],
          },
        ],
      },
    });
  }

  /**
   * Create a new task.
   *
   * @param createTaskDto The data for creating the task.
   * @param file The uploaded file (if applicable).
   * @returns The created task's information.
   */
  async createTask(
    { description, title }: CreateTaskDto,
    image: any,
    user: User,
  ) {
    const task = await this.prisma.task.create({
      data: {
        description,
        title,
        picture_url: image.url,
        user: { connect: { id: user.id } },
      },
    });

    return task;
  }

  /**
   * Retrieve a task by its ID.
   *
   * @param id The unique identifier of the task.
   * @returns The task's information.
   * @throws NotFoundException if the task with the specified ID is not found.
   */
  async getTaskById(id: string, user: User) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId: user.id },
    });
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  /**
   * Delete a task by its ID.
   *
   * @param id The unique identifier of the task to be deleted.
   * @throws NotFoundException if the task with the specified ID is not found.
   */
  async deleteTaskById(id: string, user: User) {
    const task = await this.getTaskById(id, user);
    this.prisma.task.delete({ where: { id: task.id } });
  }

  /**
   * Update the status of a task.
   *
   * @param id The unique identifier of the task.
   * @param status The new status to be assigned to the task.
   * @returns The updated task's information, including the newly assigned status.
   * @throws NotFoundException if the task with the specified ID is not found.
   */
  async updateTaskStatus(id: string, status: TaskStatus, user: User) {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.prisma.task.update({ data: { status }, where: { id: task.id } });
    return task;
  }
}
