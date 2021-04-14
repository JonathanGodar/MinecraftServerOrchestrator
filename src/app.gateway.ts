import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  WsResponse,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'node:dgram';
import { Subscription } from 'rxjs';
import { Server } from 'socket.io';
import { ServerService } from './server/server.service';

@WebSocketGateway(3018)
export class AppGateway implements OnModuleInit, OnModuleDestroy {
  @WebSocketServer() wss: Server;

  constructor(private readonly serverService: ServerService) {}
  onModuleDestroy() {
    this.subscription.unsubscribe();
  }

  subscription: Subscription;
  onModuleInit() {
    this.subscription = this.serverService.serverUpdate.subscribe((val) => {
      this.wss.emit('serverUpdate', val);
    });
    // this.serverService.serverStatus
    // this.wss.emit('wow',)
  }

  //   @SubscribeMessage('message')
  //   handleMessage(client: Socket, payload: string): WsResponse<string> {
  //       client.
  //   }
}
