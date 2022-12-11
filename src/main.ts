import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENVIRONMENT } from './common/constants';
import { LoggingInterceptor, TimeoutInterceptor } from './common/interceptors';
import { CustomLogger } from './common/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new LoggingInterceptor(), new TimeoutInterceptor());
  app.setGlobalPrefix('api/v1');
  const configService: ConfigService = app.get(ConfigService);
  const port = configService.get(ENVIRONMENT).port;
  await app.listen(port || 3000);
}
bootstrap();
