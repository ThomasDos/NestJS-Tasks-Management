import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private tasksService: TasksService) {}

  /**
   * Get tasks based on optional filters.
   *
   * @param filterDto Filters for querying tasks (optional).
   * @returns List of tasks based on the applied filters, or all tasks if no filters are provided.
   */
  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User) {
    this.logger.verbose(`User "${user.username}" retrieving all tasks`);
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilters(filterDto, user);
    }
    return this.tasksService.getAllTasks(user);
  }

  /**
   * Create a new task.
   *
   * @param createTaskDto The data for creating the task.
   * @param file The uploaded file (if applicable).
   * @returns The created task's information.
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return this.tasksService.createTask(createTaskDto, file, user);
  }

  /**
   * Get a task by its ID.
   *
   * @param id The unique identifier of the task.
   * @returns The task's information.
   */
  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.getTaskById(id, user);
  }

  /**
   * Delete a task by its ID.
   *
   * @param id The unique identifier of the task to be deleted.
   * @returns A confirmation message indicating the successful deletion.
   */
  @Delete('/:id')
  deleteTaskById(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.deleteTaskById(id, user);
  }

  /** Update the status of a task.
   *
   * @param id The unique identifier of the task.
   * @param status The new status to be assigned to the task.
   * @returns The updated task's information, including the newly assigned status.
   */
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() { status }: UpdateTaskStatusDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
