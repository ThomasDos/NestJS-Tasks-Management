import { Args, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'nestjs-prisma';

@Resolver('Task')
export class TasksResolvers {
  constructor(private prisma: PrismaService) {}

  @Query()
  async task(@Args('taskId') taskId: string) {
    return this.prisma.task.findFirst({ where: { id: taskId } });
  }

  @Query()
  async tasks() {
    return this.prisma.task.findMany();
  }
}
