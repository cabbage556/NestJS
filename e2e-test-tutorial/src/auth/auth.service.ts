import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService, //
    private jwtService: JwtService, //
    private configService: ConfigService,
  ) {}

  async signup(authDto: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(authDto.password);

    try {
      // save the new user in the db
      const user = await this.prismaService.user.create({
        data: {
          email: authDto.email,
          hash,
        },
      });
      // delete hash before we return the saved user
      delete user.hash;
      // return the saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique 필드 문제 발생 시 에러 코드가 P2002로 나옴(프리즈마의 에러 코드)
        if (error.code === 'P2002')
          throw new ForbiddenException('Credentials taken');
      } else {
        throw error;
      }
    }
  }

  async signin(authDto: AuthDto) {
    // find the user by email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authDto.email,
      },
    });
    // if user does not exist throw exception
    if (!user)
      throw new ForbiddenException('Credentials incorrect');

    // compare password
    const pwMatches = await argon.verify(
      user.hash,
      authDto.password,
    );
    // if password incorrect throw exception
    if (!pwMatches)
      throw new ForbiddenException('Credentials incorrect');

    // send back the user
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.configService.get('JWT_SECRET');
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
