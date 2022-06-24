import { Inject, Injectable } from '@nestjs/common';
import { createQueryBuilder, getConnection, Repository } from 'typeorm';
import { ServerListEntity } from './server_list.entity';
@Injectable()
export class ServerListService {
  constructor(
    @Inject('SERVER_LIST_REPOSITORY') private readonly botRepository: Repository<ServerListEntity>,
  ) { }
  async serverList() {
    const connection = await getConnection();
    return await connection.getRepository(ServerListEntity).createQueryBuilder("server_list").select(['ID', 'Name', 'Status']).getRawMany();
  }

  getServerList() {
    return this.botRepository.find({});
  }

  getServerDetail(id: number) {
    return this.botRepository.findOne(id);
  }
}
