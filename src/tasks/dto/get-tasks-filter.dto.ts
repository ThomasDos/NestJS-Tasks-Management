import { TaskStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const getTaskFilterSchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  search: z.string().optional(),
});

export class GetTasksFilterDto extends createZodDto(getTaskFilterSchema) {}
