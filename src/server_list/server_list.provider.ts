import { Connection } from 'typeorm';
import { ServerListEntity } from './server_list.entity';

export const serverListProvider = [
  {
    provide: 'SERVER_LIST_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(ServerListEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
