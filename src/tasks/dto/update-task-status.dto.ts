import { TaskStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const updateTaskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatus),
});

export class UpdateTaskStatusDto extends createZodDto(updateTaskStatusSchema) {}
