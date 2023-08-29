import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthEvent } from './event/create-user.event';
import { JwtPayload } from './jwt/jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async signUp({ username, password }: AuthCredentialsDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      const user = await this.prisma.user.create({
        data: { username, password: hashedPassword, tasks: { create: [] } },
        include: { tasks: true },
      });

      const authEvent = new AuthEvent();
      authEvent.username = user.username;
      authEvent.id = user.id;
      this.eventEmitter.emit('user.registered', authEvent);

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
