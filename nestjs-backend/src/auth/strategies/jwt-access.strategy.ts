import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IGetUser } from 'src/commons/interfaces/get-user.decorator.interface';

// PassportStrategy(인가 처리 방식, 인증 방식 이름)
//    만료 기간이 남았는지, 시크릿키로 복호화가 되는지를 확인
//    인가 처리 방식은 passport-jwt 사용
//    인증 방식 이름의 경우 UseGuard에서 사용한 문자열과 같은 문자열이어야 함
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    // JWT 옵션값 전달하며 부모 클래스의 생성자 함수 호출
    // 부모 클래스의 생성자 함수는 토큰 검증 로직 수행
    //    유효한 토큰인지 확인
    //    토큰 만료 시간이 남았는지 확인
    super({
      // Authorization 헤더에서 JWT 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // JWT 서명 생성 시 사용한 시크릿 키
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  // 액세스 토큰 검증 성공 시 액세스 토큰의 페이로드를 validate의 payload로 넘겨줌
  //           검증 실패 시 401 Unauthorized 에러 반환
  validate(payload: any): IGetUser {
    const { sub: id, email } = payload;
    return { id, email };
  }
}
