import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signUp({ username, password }: AuthCredentialsDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      const user = await this.prisma.user.create({
        data: { username, password: hashedPassword, tasks: { create: [] } },
        include: { tasks: true },
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('This user already exist');
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async signIn({ username, password }: AuthCredentialsDto) {
    const user = await this.prisma.user.findFirst({ where: { username } });
    if (!user) {
      throw new NotFoundException();
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      const payload: JwtPayload = { username };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
