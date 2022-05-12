import { EntityRepository } from 'typeorm';
import { User } from './entities/user.entity';
import { ModelRepository } from '../model.repository';
import { UserEntity } from './serializers/user.serializer';
import { plainToClass, classToPlain } from 'class-transformer';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(User)
export class UsersRepository extends ModelRepository<User, UserEntity> {
  async getUsersByEmail(email: string, username: string): Promise<UserEntity[]> {
    return this.find({
      where: {
        username: username,
      },
    }).then((entity) => {
      if (!entity) {
        return Promise.reject(new NotFoundException('Model not found'));
      }

      return Promise.resolve(entity ? this.transformMany(entity) : null);
    });
  }

  async getUserByUserName(username: string): Promise<UserEntity> {
    return await this.findOne({
      where: { username: username },
    }).then((entity: User) => {
      if (!entity) {
        return Promise.reject(new NotFoundException('Model not found'));
      }

      return Promise.resolve(entity ? this.transform(entity) : null);
    });
  }

  transform(model: User): UserEntity {
    const transformOptions = {};

    return plainToClass(
      UserEntity,
      classToPlain(model, transformOptions),
      transformOptions,
    );
  }

  transformMany(models: User[]): UserEntity[] {
    return models.map((model) => this.transform(model));
  }
}
