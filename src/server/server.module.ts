import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsServerGuard } from 'src/guards/is-server.guard';
import { ServerEntity } from './entity/server.entity';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServerEntity]), HttpModule, ConfigModule],
  providers: [ServerService, IsServerGuard],
  controllers: [ServerController],
  exports: [ServerService],
})
export class ServerModule {}
