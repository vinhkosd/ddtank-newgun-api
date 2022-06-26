import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../models/users/users.service';
import { UsersRepository } from '../models/users/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../models/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JsonWebTokenStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { EXPIRES_TIME, JWT_SECRET_KEY } from '../config/constants';
import { ServerListService } from 'src/server_list/server_list.service';
import { serverListProvider } from 'src/server_list/server_list.provider';
import { LogCardService } from 'src/log_card/log_card.service';
import { logCardProvider } from 'src/log_card/log_card.provider';
import { DatabaseModule } from 'src/databases/database.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([UsersRepository]),
    PassportModule,
    DatabaseModule,
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: EXPIRES_TIME },
    }),
  ],
  providers: [...serverListProvider, ...logCardProvider,AuthService, UsersService, ServerListService, LogCardService, LocalStrategy, JsonWebTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
