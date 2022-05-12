import { IsNotEmpty, IsString, MaxLength, IsEmail } from 'class-validator';

export class CreateUserDto {
  // @IsString()
  // @MaxLength(255)
  // @IsNotEmpty()
  // name: string;

  // @IsEmail()
  // email: string;

  // @IsNotEmpty()
  // password: string;

  id: number;

  @IsNotEmpty()
  @MaxLength(255)
  username: string;

  @IsNotEmpty()
  password: string;

  money: number;

  vip_level: number;

  vip_exp: number;

  phone_number: string;

  @IsNotEmpty()
  email: string;

  create_at: Date;

  is_exist: boolean;
}
