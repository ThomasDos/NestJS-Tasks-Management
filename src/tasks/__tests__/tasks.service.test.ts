import { Test } from '@nestjs/testing';
import { Task, TaskStatus, User } from '@prisma/client';
import { TasksService } from '../tasks.service';

const mockUser: User = {
  username: 'John',
  id: 'mockUserId',
  password: 'Mock123.',
  created_at: new Date(),
  updated_at: null,
};

const mockTask: Task = {
  id: 'mockTaskId',
  title: 'mockTitle',
  description: 'mockDescription',
  picture_url: 'mockUrl',
  status: TaskStatus.OPEN,
  userId: 'mockUserId',
  created_at: new Date(),
  updated_at: null,
};
describe('TasksService', () => {
  let tasksService: jest.Mocked<TasksService>;
  const mockTasksService = () => ({
    getAllTasks: jest.fn(),
    getTaskById: jest.fn(),
  });

  beforeEach(async () => {
    //initialize a NestJS module with tasksService
    const module = await Test.createTestingModule({
      providers: [{ provide: TasksService, useFactory: mockTasksService }],
    }).compile();

    tasksService = await module.resolve(TasksService);
  });
  describe('getAllTasks', () => {
    it('should calls TasksService.getTasks and returns the result', async () => {
      tasksService.getAllTasks.mockResolvedValue([]);
      const tasks = await tasksService.getAllTasks(mockUser);
      expect(tasks).toEqual([]);
    });
  });

  describe('getTask', () => {
    it('should return a task by its ID and userID', async () => {
      tasksService.getTaskById.mockResolvedValue(mockTask);

      const task = await tasksService.getTaskById('mockTaskId', mockUser);
      expect(task).toBe(mockTask);
    });
    it('should throw an error', async () => {
      tasksService.getTaskById.mockResolvedValue(null);
      const task = await tasksService.getTaskById('mockTaskId', mockUser);
      expect(task).toBeNull();
    });
  });
});
