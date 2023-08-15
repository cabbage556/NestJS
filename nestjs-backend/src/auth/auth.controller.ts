import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { GetUser } from 'src/commons/get-user.decorator';
import { IGetUser } from 'src/commons/interfaces/get-user.decorator.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './guards/jwt-strategy.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  @HttpCode(HttpStatus.OK) // 200 OK
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto, //
    @Res() res: Response,
  ): Promise<void> {
    // 서비스 로직을 통해 로그인 처리하기
    res.send(await this.authService.login(loginDto, res));
  }

  // 'local' passport-local strategy
  //    LocalAuthGuard를 통해 로그인 처리하기
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/login2')
  login2(
    @GetUser() user: IGetUser, //
  ): { accessToken: string } {
    return this.authService.login2(user);
  }

  // 'refresh' passport-jwt strategy
  @UseGuards(JwtAuthGuard(JwtStrategy.REFRESH))
  @Get('/restore-token')
  restoreAccessToken(
    @GetUser() user: IGetUser, //
  ): { accessToken: string } {
    return this.authService.restoreAccessToken(user);
  }
}
