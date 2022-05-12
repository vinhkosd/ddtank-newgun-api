import { IUser } from '../interfaces/user.interface';
import { ModelEntity } from '../../model.serializer';

export class UserEntity extends ModelEntity implements IUser {
  id: number;

  email: null | string;

  username: null | string;

  password: string;
}
