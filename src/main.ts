import { HttpModule, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as http from 'http';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // const server = http.createServer(app as any);
  app.useGlobalPipes(new ValidationPipe());
  // Socket io setup

  // const io = new socketIo.Server();
  // io.attach(app.getHttpServer());

  // io.on('connection', (socket: socketIo.Socket) => {
  //   socket.emit('status', 'Hello world from socket io!');
  // });

  await app.listen(3019);
}
bootstrap();
