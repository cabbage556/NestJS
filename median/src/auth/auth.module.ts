import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategy/jwt.strategy';

// never store the secret directly in your codebase
// NestJS provides the @nestjs/config package for loading secrets from environment variables
export const jwtSecret = 'dlfkjdaslfji4j5ioj34oij1kndfk;and4i95u19';

@Module({
  imports: [
    PrismaModule, //
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: '5m', // 30s, 7d, 24h
      },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
