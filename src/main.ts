import { AppModule } from '@/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const port = 3000;
  await app.listen(port);
  logger.log(`Application is listening on port ${port}`);
}
bootstrap();
