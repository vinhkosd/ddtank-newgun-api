import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../models/users/dto/CreateUser.dto';
import { UsersService } from '../models/users/users.service';
import { AuthService } from './auth.service';
import { AuthenticationGuard } from './guards/auth.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { UserEntity } from '../models/users/serializers/user.serializer';
import { REQUEST_URL, KEY_REQUEST, LINK_FLASH, LINK_CONFIG } from '../config/constants';
import { v4 as uuid } from 'uuid';
import { SkipThrottle } from '@nestjs/throttler';
const axios = require('axios').default;

@Controller()
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/register')
  async registerUser(@Body() input: CreateUserDto) {
    const check = await this.validate(input.email, input.username);
    if (!check) {
      throw new HttpException(
        { message: 'User already exists' },
        HttpStatus.BAD_REQUEST,
      );
    }

    input.password = await this.authService.hashPassword(input.password);
    input.money = 0;
    input.vip_level = 0;
    input.vip_exp = 0;
    input.phone_number = "";
    input.create_at = new Date();
    input.is_exist = true;

    return this.userService.create(input);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() request): Promise<any> {
    return this.authService.login(request.user);
  }

  @UseGuards(AuthenticationGuard)
  @Get('current-user')
  async getUserLoggedIn(@Request() request): Promise<UserEntity> {
    return this.userService.findById(request.user.id);
  }

  @UseGuards(AuthenticationGuard)
  @Post('/logout')
  async getUserLogout(@Response() response): Promise<Response> {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    response.clearCookie('access_token');
    response.clearCookie('token');

    return response.sendStatus(200);
  }

  @UseGuards(AuthenticationGuard)
  @SkipThrottle()
  @Get('create-login')
  async createLogin(@Request() request): Promise<string> {
    var keyrand = uuid().toUpperCase();

    var timeNow = (+ new Date() / 1000).toFixed(0).toString();

    var url = `${REQUEST_URL}CreateLogin.aspx?content=${request.user.name}|${keyrand}|${timeNow}|${await this.authService.hashPassword(request.user.name + keyrand + timeNow + KEY_REQUEST)}`;
    
    const response = await axios.get(url);

    var status = response.data;
    if(status = "0") {
      return `${LINK_FLASH}Loading.swf?user=${request.user.name}&key=${keyrand}&v=104&rand=92386938&config=${LINK_CONFIG}`;
    }
    
    return status;
  }

  async validate(email: string, username: string) {
    try {
      const users = await this.userService.geUsersByEmail(email, username);
      return users.length <= 0;
    } catch (e) {
      return false;
    }
  }
}
