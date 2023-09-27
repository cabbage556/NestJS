import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService, //
  ) {}

  @Post('signup')
  signup(
    @Body(new ValidationPipe()) authDto: AuthDto, //
  ) {
    return this.authService.signup(authDto);
  }

  @HttpCode(HttpStatus.OK) // 리소스를 생성하지 않으므로 200 OK 상태코드로 리턴
  @Post('signin')
  signin(
    @Body(new ValidationPipe()) authDto: AuthDto, //
  ) {
    return this.authService.signin(authDto);
  }
}
