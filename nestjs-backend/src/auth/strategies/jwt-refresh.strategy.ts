import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { IGetUser } from 'src/commons/interfaces/get-user.decorator.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: (req: Request): string => {
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken=', '');
        return refreshToken;
      },
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  // 리프레시 토큰 검증 성공 시 리프레시 토큰의 페이로드가 validate의 payload로 들어옴
  //            검증 실패 시 401 Unauthorized 에러 반환
  validate(payload: any): IGetUser {
    console.log(payload);
    const { sub: id, email } = payload;
    return { id, email };
  }
}
