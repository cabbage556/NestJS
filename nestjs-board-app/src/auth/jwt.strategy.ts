import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
import * as config from "config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService, //
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET || config.get("jwt").secret, // JWT 서명 생성 비밀키와 같아야 함
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // 요청 헤더에 포함된 JWT(Authorization 헤더 Bearer 토큰)의 헤더와 페이로드로 서명 부분을 재생성하여 전달받은 JWT의 서명 부분과 비교
  //    일치하면 validate 메서드 실행
  //    일치하지 않으면 401 에러
  // payload: JWT 페이로드
  async validate(payload) {
    // JWT를 발급할 때 페이로드에 추가한 name 가져오기
    const { name } = payload;

    // 유저가 없으면 401 에러
    const user = await this.userService.getUserByName(name);
    if (!user) {
      throw new UnauthorizedException("user not founded");
    }

    return user;
  }
}
