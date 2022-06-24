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
  Header,
  Res,
  BadRequestException,
  Session,
  Param,
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
import { ServerListService } from '../server_list/server_list.service';
import { createConnection } from 'typeorm';
import { connect } from 'http2';
var _ = require('lodash');
const axios = require('axios').default;
var soap = require('soap');

const SERVER_CLOSED = 0;
const SERVER_OPEN = 2;
const SERVER_MAINTAIN = 1;
const SERVER_HOT = 3;

const SERVER_STATUS_CODE = {
  0: 'Đóng',
  2: 'Mở',
  3: 'Hot',
  1: 'Bảo trì',
}

@Controller()
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private serverListService: ServerListService,
  ) {}

  @Post('/register')
  async registerUser(@Body() input: CreateUserDto) {
    const check = await this.validate(input.email, input.username);
    if (!check) {
      throw new HttpException(
        { message: 'Tài khoản đã tồn tại' },
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
    // if(request.body.captcha == request.session.captcha) {
      return this.authService.login(request.user);
    // } else {
    //   console.log(session);
    //   throw new HttpException(request.body.captcha + 'Captcha không chính xác' + session.captcha, HttpStatus.FORBIDDEN);
    // }
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
    try{
      var keyrand = uuid().toLowerCase();

      var timeNow = (+ new Date() / 1000).toFixed(0).toString();

      var url = `${REQUEST_URL}CreateLogin.aspx?content=${request.user.name}|${keyrand}|${timeNow}|${await this.authService.hashPassword(request.user.name + keyrand + timeNow + KEY_REQUEST)}`;
      
      const response = await axios.get(url);

      var status = response.data;
      if(status = "0") {
        return `${LINK_FLASH}Loading.swf?user=${request.user.name}&key=${keyrand}&v=104&rand=92386938&config=${LINK_CONFIG}`;
      }
      
      return status;
    } catch(e) {
      console.log(e);
      return null;
    }
    
  }

  @UseGuards(AuthenticationGuard)
  @SkipThrottle()
  @Get('create-login/:id')
  async createLoginServerId(@Param('id') id: number, @Request() request): Promise<string> {
    
    var server = await this.serverListService.getServerDetail(id);
    
    var userDetail = await this.userService.findById(request.user.id);
    if(SERVER_OPEN == server.Status || SERVER_HOT == server.Status || userDetail.vip_level >= 12){
      try{
        var keyrand = uuid().toLowerCase();
  
        var timeNow = (+ new Date() / 1000).toFixed(0).toString();
  
        var url = `${server.RequestUrl}CreateLogin.aspx?content=${request.user.name}|${keyrand}|${timeNow}|${await this.authService.hashPassword(request.user.name + keyrand + timeNow + server.KeyRequest)}`;
        
        const response = await axios.get(url);
  
        var status = response.data;
        if(status = "0") {
          return `${server.FlashUrl}Loading.swf?user=${request.user.name}&key=${keyrand}&v=104&rand=92386938&config=${server.ConfigUrl}`;
        }
        
        return status;
      } catch(e) {
        console.log(e);
        console.log(request.user);
        return null;
      }
    }
    return `Máy chủ hiện đã ${SERVER_STATUS_CODE[server.Status]}`;
  }

  @UseGuards(AuthenticationGuard)
  @SkipThrottle()
  @Get('create-flash-link')
  async createFlashLink(@Request() request): Promise<string> {
    var keyrand = uuid().toLowerCase();

    var timeNow = (+ new Date() / 1000).toFixed(0).toString();

    var url = `${REQUEST_URL}CreateLogin.aspx?content=${request.user.name}|${keyrand}|${timeNow}|${await this.authService.hashPassword(request.user.name + keyrand + timeNow + KEY_REQUEST)}`;
    
    const response = await axios.get(url);

    var status = response.data;
    if(status = "0") {
      return `${LINK_FLASH}Loading.swf|user=${request.user.name}&key=${keyrand}&v=104&rand=92386938&config=${LINK_CONFIG}`;
    }
    
    return status;
  }

  @UseGuards(AuthenticationGuard)
  @SkipThrottle()
  @Get('create-flash-link/:id')
  async createFlashLinkWithSv(@Param('id') id: number, @Request() request): Promise<string> {
    var server = await this.serverListService.getServerDetail(id);
    
    var userDetail = await this.userService.findById(request.user.id);
    if(SERVER_OPEN == server.Status || SERVER_HOT == server.Status || userDetail.vip_level >= 12){
      var keyrand = uuid().toLowerCase();

      var timeNow = (+ new Date() / 1000).toFixed(0).toString();

      var url = `${server.RequestUrl}CreateLogin.aspx?content=${request.user.name}|${keyrand}|${timeNow}|${await this.authService.hashPassword(request.user.name + keyrand + timeNow + server.KeyRequest)}`;
      
      const response = await axios.get(url);

      var status = response.data;
      if(status = "0") {
        return `${server.FlashUrl}Loading.swf|user=${request.user.name}&key=${keyrand}&v=104&rand=92386938&config=${server.ConfigUrl}`;
      }
      
      return status;
    }

    return `Máy chủ hiện đã ${SERVER_STATUS_CODE[server.Status]}`;
  }

  @UseGuards(AuthenticationGuard)
  @Post('serverlist')
  async getServerList(@Request() request): Promise<string> {
    var KQ = '';
    var x = 32;
    var y = 18;
    var serverList = await this.serverListService.getServerList();
    serverList.forEach(element => {
      KQ += `${element.id},${element.Name},${x},${y}|`;
      // KQ;
      x += 208;
    });
    // while($svInfo = sqlsrv_fetch_array($loadserver, SQLSRV_FETCH_ASSOC)) {
      //echo '<option value="'.$svInfo['ServerID'].'">'.$svInfo['ServerName'].'</option>';
      
    // }
    return KQ;
  }

  @UseGuards(AuthenticationGuard)
  @Get('check-open')
  async getCheckOpen(@Request() request): Promise<string> {
    return 'True';
  }

  @UseGuards(AuthenticationGuard)
  @Post('update')
  async update(@Request() request): Promise<any> {
    const user = await this.userService.findById(parseInt(request.user.id, 0));
    if (!user) {
      throw new HttpException("User don't exists", HttpStatus.NOT_FOUND);
    }
    var oldPassMd5 = await this.authService.hashPassword(request.body.oldpassword);
    
    if(user.password == oldPassMd5){
      var update = _.pick( request.body, 'password');
      update.password = await this.authService.hashPassword(update.password);
      await this.userService.update(user, update);
      return 'Đổi thông tin thành công';
    }
    
    return 'Dữ liệu không hợp lệ';
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() input) {
    const user = await this.userService.getUserByUserName(input.username);
    if (user) {
      if(input.email && input.email == user.email) {
        var update = _.pick( input, 'password');
        update.password = await this.authService.hashPassword(update.password);
        await this.userService.update(user, update);
        return 'Quên mật khẩu thành công!';
      }
      return 'Email không chính xác';
    } else {
      return "Tài khoản không tồn tại";
    }
  }
  
  @Get('/captcha')
  @Header('content-type', 'image/svg+xml')
  async captcha(@Request() request, @Session() session: Record<string, any>) : Promise<any> {
    var svgCaptcha = require('svg-captcha');

    var captcha = svgCaptcha.create({
      size: 3
    });
    session.captcha = captcha.text;
    // console.log(captcha);
    return captcha.data;
  }

  @UseGuards(LocalAuthGuard)
  @Get('/valid-captcha')
  async validCaptcha(@Request() request) : Promise<any> {
    return request.session.captcha
  }

  @UseGuards(AuthenticationGuard)
  @Post('chargeMoney')
  async chargeMoney(@Request() request): Promise<any> {
    const user = await this.userService.findById(parseInt(request.user.id, 0));
    if (!user) {
      throw new HttpException("User don't exists", HttpStatus.NOT_FOUND);
    }
    var svId = request.body.server_id;
    console.log(request.body);
    var server = await this.serverListService.getServerDetail(svId);
    var portOptions = {};
    if(server.Port && server.Port > 0) {
      portOptions = {port: server.Port}
    }
    var connection = await createConnection({
      name:`dbPlayer${svId}${+(new Date())}`,
      type: 'mssql',
      host: server.DataSource,
      username: server.UserID,
      password: server.Password,
      database: server.Catalog,
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/databases/migrations/*.js'],
      cli: { migrationsDir: 'src/databases/migrations' },
      synchronize: false,
      extra: {
        trustServerCertificate: true,
      },
      ...portOptions
    });
    // connection.createQueryRunner();
    const queryRunner = await connection.createQueryRunner();
    var total = await queryRunner.manager.query(
      `SELECT COUNT(*) as total FROM Charge_Money`
    );
    var userDetail = await queryRunner.manager.query(
      `select UserID,NickName from Sys_Users_Detail where UserName = '${request.user.name}'`
    );
    var chargeID = total[0] ? total[0].total : 0;
    var playerID = userDetail[0] ? userDetail[0].UserID : 0;
    var NickName = userDetail[0] ? userDetail[0].NickName : 0;
    chargeID = await this.authService.hashPassword(chargeID.toString());
    var money = parseInt(request.body.money);
    console.log(money);
    console.log(request.body);
    if(isNaN(money)) {
      money = 0;
    }
    
    console.log(chargeID);
    console.log(money);

    var resultText = 'ok';

    if(user.money > money) {
      var update = _.pick( user, 'money');
      update.money -= money;
      await this.userService.update(user, update);
      if(money > 0) {
        var result = await queryRunner.manager.query(
            `INSERT INTO Charge_Money
            ([ChargeID]
            ,[UserName]
            ,[Money]
            ,[CanUse]
            ,[PayWay]
            ,[NeedMoney]
            ,[NickName])
          VALUES
            ('${chargeID}'
            ,N'${request.user.name}'
            ,${money}
            ,1
            ,0
            ,0
            ,N'${NickName}'
            )`
        );
  
        var url = `${server.RequestUrl}/ChargeToUser.aspx?userID=${playerID}&chargeID=${chargeID}`;
        console.log(url);
        
        const response = await axios.get(url);
       
        
      } else {
        resultText= 'Dữ liệu không hợp lệ';
      }
    } else {
      resultText= 'Số dư không đủ';
    }

    
    
    connection.close();

    
    return resultText;
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
