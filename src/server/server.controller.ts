import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { query } from 'express';
import { Server } from 'node:http';
import { IsServerGuard } from 'src/guards/is-server.guard';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { ServerService } from './server.service';

@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Get()
  get(@Query() query: any) {
    return this.serverService.find(query);
  }

  @Get('active')
  getActive() {
    return this.serverService.getActiveServer();
  }

  @Get('available')
  getAvailable() {
    return this.serverService.getAvailableServers();
  }

  @Post('bootComplete/:id')
  @UseGuards(IsServerGuard)
  bootComplete(@Param('id') id: string) {
    return this.serverService.bootCompelte(id);
  }

  @Post()
  @UseGuards(IsServerGuard)
  create(@Body() body: CreateServerDto) {
    return this.serverService.create(body);
  }

  @Post('start/:id')
  startServer(@Param('id') id: string) {
    return this.serverService.startServer(id);
  }

  @Post('switchActive/:id')
  switchToServer(@Param('id') id: string) {
    return this.serverService.switchServer(id);
  }

  @Post('stop')
  async stop() {
    await this.serverService.queueStop();
    return 'Stop successfull!';
  }

  @Post('stopComplete/:id')
  @UseGuards(IsServerGuard)
  async stopComplete(@Param('id') id: string) {
    await this.serverService.stopComplete(id);
  }

  @Patch(':id')
  @UseGuards(IsServerGuard)
  update(@Param('id') id: string, @Body() body: UpdateServerDto) {
    this.serverService.update(id, body);
  }

  @Post('available/:id')
  @UseGuards(IsServerGuard)
  available(@Param('id') id: string) {
    this.serverService.notAvailable(id);
  }

  @Post('notAvailable/:id')
  @UseGuards(IsServerGuard)
  notAvailable(@Param('id') id: string) {
    this.serverService.available(id);
  }
}
