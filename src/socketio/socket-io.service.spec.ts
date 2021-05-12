import { Test, TestingModule } from '@nestjs/testing';
import { SocketIOService } from './socket-io.service';

import { io, Socket } from 'socket.io-client';
import { SimpleConsoleLogger, UsingJoinColumnIsNotAllowedError } from 'typeorm';
import { SocketIOModule } from './socket-io.module';

describe('AppController', () => {
  //   let socket: Socket;
  let service: SocketIOService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [SocketIOModule],
      //   providers: [SocketIOService],
    }).compile();

    service = app.get<SocketIOService>(SocketIOService);
    // socket = io(service.getAddress());
  });

  describe('should connect', async () => {
    const socket = io(service.getAddress());
    expect.assertions(1);
    socket.onAny((data) => {
      console.log(data);
      expect(true).toBe(true);
    });
    // it('shoculd return "Hello World!"', () => {
    //   expect(appController.getHello()).toBe('Hello World!');
    // });
  });
});
