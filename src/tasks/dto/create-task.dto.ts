import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createTaskSchema = z
  .object({
    title: z.string().nonempty(),
    description: z.string().nonempty(),
  })
  .required();

export class CreateTaskDto extends createZodDto(createTaskSchema) {}
