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
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/commons/get-user.decorator';
import { IGetUser } from 'src/commons/interfaces/get-user.decorator.interface';

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
    res.send(await this.authService.login(loginDto, res));
  }

  @UseGuards(AuthGuard('refresh'))
  @Get('/restore-token')
  restoreAccessToken(
    @GetUser() user: IGetUser, //
  ): { accessToken: string } {
    return this.authService.restoreAccessToken(user);
  }
}
