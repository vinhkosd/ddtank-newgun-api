import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ServerListService } from './server_list.service';

@Controller('server')
export class ServerListController {
  constructor(
    private serverListService: ServerListService,
  ) { }

  @Get("list")
  async serverList() {
    return await this.serverListService.serverList();
  }

  @Get("all")
  async getServerList() {
    return await this.serverListService.getServerList();
  }

  @Get(':id')
  getDetailBot(@Param('id') id: number) {
    return this.serverListService.getServerDetail(id);
  }
}
