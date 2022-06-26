import { Connection } from 'typeorm';
import { LogCardEntity } from './log_card.entity';

export const logCardProvider = [
  {
    provide: 'LOG_CARD_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(LogCardEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
