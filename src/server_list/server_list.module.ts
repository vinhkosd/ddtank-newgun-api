import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/databases/database.module';
import { ServerListController } from './server_list.controller';
import { ServerListEntity } from './server_list.entity';
import { serverListProvider } from './server_list.provider';
import { ServerListService } from './server_list.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServerListEntity]),
    DatabaseModule,
  ],
  controllers: [ServerListController],
  providers: [...serverListProvider, ServerListService],
})
export class ServerListModule { }
