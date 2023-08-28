import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthEvent } from '../event/create-user.event';

@Injectable()
export class CreateUserListener {
  @OnEvent('user.registered')
  handleUserRegisteredEvent(event: AuthEvent) {
    console.log(event);
  }
}
