import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import User from 'src/users/model/user.model';
import { IGetUser } from 'src/commons/interfaces/get-user.decorator.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, //
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    loginDto: LoginDto,
    res: Response,
  ): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    const { id } = await this.validateUser(email, password);

    // 쿠키에 리프레시 토큰을 담아 전달
    this.setRefreshToken(id, email, res);

    // 응답 메시지 바디에 액세스 토큰을 담아 전달
    return {
      accessToken: this.getAccessToken(id, email),
    };
  }

  login2(user: IGetUser): { accessToken: string } {
    const { id, email } = user;
    return {
      accessToken: this.getAccessToken(id, email),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new UnprocessableEntityException('user not founded');
    }

    const isPasswordMatched = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatched) {
      throw new UnprocessableEntityException('password not matched');
    }

    return user;
  }

  setRefreshToken(id: string, email: string, res: Response): void {
    const payload = {
      sub: id,
      email,
    };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/`);
  }

  getAccessToken(id: string, email: string): string {
    const payload = {
      sub: id, // subject claim(the user)
      email,
    };
    return this.jwtService.sign(payload);
  }

  restoreAccessToken(user: IGetUser): { accessToken: string } {
    const { id, email } = user;
    return {
      accessToken: this.getAccessToken(id, email),
    };
  }
}
