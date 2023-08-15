import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { jwtAccessConfig } from 'src/config/jwt-access.config';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    UsersModule, //
    JwtModule.registerAsync(jwtAccessConfig),
  ],
  controllers: [
    AuthController, //
  ],
  providers: [
    AuthService, //
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
