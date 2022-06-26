import { Inject, Injectable } from '@nestjs/common';
import { createQueryBuilder, getConnection, Repository } from 'typeorm';
import { LogCardEntity } from './log_card.entity';
@Injectable()
export class LogCardService {
  constructor(
    @Inject('LOG_CARD_REPOSITORY') private readonly logCardRepository: Repository<LogCardEntity>,
  ) { }

  getRepository(): Repository<LogCardEntity> {
    return this.logCardRepository;
  }
}
