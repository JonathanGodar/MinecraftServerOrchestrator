import { Module } from '@nestjs/common';
import { SocketIOService } from './socket-io.service';

@Module({
  providers: [SocketIOService],
})
export class SocketIOModule {}
