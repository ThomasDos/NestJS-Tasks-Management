import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  @ApiProperty({
    name: 'Status',
    description: 'The status of the task',
    enum: Object.values(TaskStatus),
  })
  status: TaskStatus;
}
