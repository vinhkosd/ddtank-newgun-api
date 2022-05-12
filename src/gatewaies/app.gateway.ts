import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { HttpException, HttpStatus, Logger, UseGuards } from '@nestjs/common';
import { WsGuard } from './guards/validation';
import { MessagesInterface } from './interfaces/messages.interface';
import { UsersService } from '../models/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../models/users/serializers/user.serializer';

@UseGuards(WsGuard)
@WebSocketGateway(3006, { cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessageGateway');
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  handleDisconnect(client: any) {
    throw new Error('Method not implemented.');
  }
  handleConnection(client: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  afterInit(server: any): any {
    this.logger.log(server, 'Init');
  }

  async getDataUserFromToken(client: Socket): Promise<UserEntity> {
    const authToken: any = client.handshake?.query?.token;
    try {
      const decoded = this.jwtService.verify(authToken);

      return await this.userService.getUserByUserName(decoded.username); // response to function
    } catch (ex) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
