import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { IGetUser } from 'src/commons/interfaces/get-user.decorator.interface';

// https://docs.nestjs.com/recipes/passport 참고

// With @nestjs/passport, configure a Passport strategy by extending the PassportStrategy class
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly authService: AuthService, //
  ) {
    // 1. A set of options that are specific to the strategy
    //    With @nestjs/passport, pass the strategy options by calling the super() method in subclass,
    //    optionally passing in an options object

    // in our case with passport-local(username, password authentication), there are no configuration options
    //    so our constructor simply calls super() without an options object
    // super();

    // username과 password를 사용하지 않는 passport strategy로 커스터마이징하기 위해 옵션 객체를 전달 가능
    //    passport-local strategy의 경우 기본적으로 username과 password 프로퍼티를 요청 바디에서 기대하는데, 다른 프로퍼티 이름으로 구성 가능
    super({ usernameField: 'email' });
  }

  // 2. A verify callback, which is where you tell Passport how to interact with your user store
  //    here you verify whether a user exists, and whether their credentials are valid
  //    With @nestjs/passport, you provide the verify callback by implementing a validate() method in subclass
  async validate(email: string, password: string): Promise<IGetUser> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('invalid user');
    }

    const { id, email: _email } = user;
    return { id, email: _email };
  }
}
