import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus, User } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from 'nestjs-prisma';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import formatBufferImageToDataUri from './utils/format-buffer-image-to-data-uri';
@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieve all tasks.
   *
   * @returns List of all tasks in the database.
   */
  async getAllTasks() {
    return await this.prisma.task.findMany();
  }

  /**
   * Retrieve tasks based on filters.
   *
   * @param filterDto Filters for querying tasks.
   * @returns List of tasks that match the applied filters.
   */
  async getTasksWithFilters(filterDto: GetTasksFilterDto) {
    const { search, status } = filterDto;
    return await this.prisma.task.findMany({
      where: {
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
    file: Express.Multer.File,
    user: User,
  ) {
    const image = await this.uploadFile(file);
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
  async getTaskById(id: string) {
    const task = await this.prisma.task.findFirst({ where: { id } });
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
  async deleteTaskById(id: string) {
    const task = await this.getTaskById(id);
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
  async updateTaskStatus(id: string, status: TaskStatus) {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.prisma.task.update({ data: { status }, where: { id: task.id } });
    return task;
  }

  /**
   * Upload a file to Cloudinary and return the uploaded image's information.
   *
   * @param file The file to be uploaded.
   * @returns The uploaded image's information.
   * @throws BadRequestException if there's an error during the upload process.
   */
  async uploadFile(file: Express.Multer.File) {
    const dataURI = formatBufferImageToDataUri(file);

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
      const image = await cloudinary.uploader.upload(dataURI, {
        resource_type: 'auto',
        transformation: [{ width: 300, height: 300, crop: 'limit' }],
      });

      return image;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
