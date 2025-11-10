import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { JwtProviderModule } from '../jwt/jwt.module';

@Module({
  imports: [
    PassportModule,
    JwtProviderModule,
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
