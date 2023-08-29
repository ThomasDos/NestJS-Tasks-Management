import { Args, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'nestjs-prisma';

@Resolver('User')
export class AuthResolver {
  constructor(private prisma: PrismaService) {}

  @Query()
  async getUser(@Args('userId') userId: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    user.password = '';
    return user;
  }
}
