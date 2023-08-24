import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v2 as cloudinary } from 'cloudinary';
import { ILike, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import formatBufferImageToDataUri from './utils/format-buffer-image-to-data-uri';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}
  async getAllTasks() {
    return await this.tasksRepository.find();
  }
  async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { search, status } = filterDto;
    return await this.tasksRepository.find({
      where: [
        {
          status,
        },
        { description: ILike(`%${search}%`) },
        { title: ILike(`%${search}%`) },
      ],
    });
  }

  async createTask(
    { description, title }: CreateTaskDto,
    file: Express.Multer.File,
  ) {
    const image = await this.uploadFile(file);
    const task = this.tasksRepository.create({
      description,
      title,
      picture_url: image.url,
    });
    const newTask = await this.tasksRepository.save(task);

    return newTask;
  }
  async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  async deleteTaskById(id: string) {
    const task = await this.getTaskById(id);
    this.tasksRepository.remove(task);
  }
  async updateTaskStatus(id: string, status: TaskStatus) {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

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
