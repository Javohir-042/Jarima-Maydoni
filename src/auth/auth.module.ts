// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module'; 
import { AccessTokenGuard } from '../common/guard';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { RefreshTokenCookieStrategy } from '../common/strategies';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  providers: [AuthService, JwtStrategy, AccessTokenGuard, RefreshTokenCookieStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
