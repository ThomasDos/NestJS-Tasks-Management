import { CallHandler, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  intercept(_, next: CallHandler<any>) {
    return next.handle().pipe(
      map((data) => {
        delete data.password;
        return data;
      }),
    );
  }
}
