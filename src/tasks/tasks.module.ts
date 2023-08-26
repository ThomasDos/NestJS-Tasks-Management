import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryService } from './services/cloudinary.service';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [AuthModule],
  controllers: [TasksController],
  providers: [TasksService, CloudinaryService],
})
export class TasksModule {}
