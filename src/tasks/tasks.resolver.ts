import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Task } from 'graphql/graphql';
import { PrismaService } from 'nestjs-prisma';

@Resolver('Task')
export class TasksResolvers {
  constructor(private prisma: PrismaService) {}

  @Query()
  async task(@Args('taskId') taskId: string) {
    return this.prisma.task.findFirst({ where: { id: taskId } });
  }

  @ResolveField()
  async user(@Parent() task: Task) {
    return await this.prisma.user.findFirst({
      where: { id: task.userId },
    });
  }

  @Query()
  async tasks() {
    return this.prisma.task.findMany();
  }
}
