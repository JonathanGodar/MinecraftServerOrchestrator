import {
  HttpCode,
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server } from 'node:http';
import { Observer, PartialObserver, Subject } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { ServerEntity } from './entity/server.entity';

export interface MinecraftServerStatus {
  type: 'booting' | 'stopping' | 'stopComplete' | 'bootCompelte';
}

export interface ServerUpdate {
  serverId: string;
  data: ServerEntity;
}

@Injectable()
export class ServerService implements OnModuleInit {
  minecraftServerStatus = new Subject<MinecraftServerStatus>();

  serverUpdate = new Subject<ServerUpdate>();

  async switchServer(id: string) {
    const server = await this.getActiveServer();
    if (server) {
      if (!server.isStopping) {
        this.queueStop();
      }
      const subscription = this.minecraftServerStatus.subscribe((obs) => {
        if (obs.type == 'stopComplete') {
          subscription.unsubscribe();
          this.startServer(id);
        }
      });
    } else {
      this.startServer(id);
    }

    return { status: 'proceeding' };
  }
  constructor(private readonly httpService: HttpService) {}

  async markServerAsUpdated(id: string) {
    this.serverUpdate.next({
      serverId: id,
      data: await ServerEntity.findOne(id),
    });
  }

  async bootCompelte(id: string) {
    this.minecraftServerStatus.next({ type: 'bootCompelte' });
    await ServerEntity.update(id, { isBooting: false });
    this.markServerAsUpdated(id);
  }
  activeServerId?: string;

  async onModuleInit() {
    this.activeServerId = (
      await ServerEntity.findOne({
        where: { isActive: true },
      })
    )?.id;

    this.minecraftServerStatus.subscribe((val) => {
      console.log('New server status: ' + val.type);
    });
  }

  async create(createServerDto: CreateServerDto) {
    return ServerEntity.create({
      ...createServerDto,
    })
      .save()
      .catch(() => {
        ServerEntity.find({ name: createServerDto.name });
      });
  }

  async startServer(id: string) {
    if (await this.isAServerRunning()) {
      throw new HttpException(
        'A server is already running',
        HttpStatus.AMBIGUOUS,
      );
    }

    const server = await ServerEntity.findOne(id);
    if (!server)
      throw new HttpException('No such server', HttpStatus.NOT_FOUND);

    if (!server.isAvailable) {
      throw new HttpException(
        'You cannot start an unavailable server',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    server.isActive = true;
    server.isBooting = true;
    this.minecraftServerStatus.next({ type: 'booting' });

    await server.save();
    this.markServerAsUpdated(id);

    console.log('sending start request!');
    this.httpService
      .post(`${server.baseUri}/start`)
      .toPromise()
      .then((val) => console.log(val.data));

    this.activeServerId = server.id;
    return server;
  }

  async queueStop() {
    const server = await this.getActiveServer();
    server.isStopping = true;
    await server.save();
    this.markServerAsUpdated(server.id);
    this.minecraftServerStatus.next({ type: 'stopping' });
    await this.httpService.post(`${server.baseUri}/stop`).toPromise();
  }

  async available(id: string) {
    await ServerEntity.update(id, {
      isAvailable: true,
    });
    this.markServerAsUpdated(id);
  }

  async notAvailable(id: string) {
    await ServerEntity.update(id, {
      isAvailable: false,
      isActive: false,
      isStopping: false,
      isBooting: false,
    });
    this.markServerAsUpdated(id);
  }

  async stopComplete(id: string) {
    await ServerEntity.update(id, {
      isActive: false,
      isBooting: false,
      isStopping: false,
    });

    this.activeServerId = undefined;
    this.minecraftServerStatus.next({ type: 'stopComplete' });
    this.markServerAsUpdated(id);
  }

  async getAvailableServers() {
    return ServerEntity.find({ where: { isAvailable: true } });
  }

  async getActiveServer() {
    if (!(await this.getActiveServerId())) {
      return undefined;
    }
    return ServerEntity.findOne(await this.getActiveServerId());
  }

  async getActiveServerId() {
    return this.activeServerId;
  }

  async isAServerRunning() {
    return !!this.activeServerId;
  }

  update(id: string, updateServerDto: UpdateServerDto) {
    return ServerEntity.update(id, updateServerDto);
  }

  find(query) {
    return ServerEntity.find({ where: query });
  }
}
