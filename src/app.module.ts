import { HttpModule, HttpService, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { ServerModule } from './server/server.module';

@Module({
  imports: [
    ServerModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'app.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    HttpModule.register({}),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      // serveStaticOptions: {}
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
