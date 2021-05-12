import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as socketio from 'socket.io';
import * as http from 'http';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

@Injectable()
export class SocketIOService implements OnModuleInit {
  private httpAdapter: ExpressAdapter;
  private server: http.Server;

  private io: socketio.Server;

  constructor(private adapterHost: HttpAdapterHost<ExpressAdapter>) {
    this.httpAdapter = adapterHost.httpAdapter;
  }

  onModuleInit() {
    this.server = this.httpAdapter.getHttpServer() as http.Server;

    this.io = new socketio.Server();
    this.io.attach(this.server);

    this.io.on('connection', (socket: socketio.Socket) => {
      console.log('hello world!');
      //   socket.emit('status', 'Hello world from socket io!');
      setInterval(() => {
        socket.send('Hello from the server!');
        socket.emit('hello', 'hello from server');
      }, 1000);
    });

    const usernamespace = this.io.of('/users');

    // usernamespace.on('connection', (socket) => {
    // })
  }

  getAddress() {
    return this.server.address().toString();
  }
}
