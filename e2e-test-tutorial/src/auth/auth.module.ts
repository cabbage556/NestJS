import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';

@Module({
  imports: [
    // 액세스 토큰과 리프레시 토큰의 서명 키와 만료 기간을 다르게 함
    //    JwtModule을 우선 등록만 하고, 서비스에서 좀 더 자세히 다루기
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
