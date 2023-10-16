import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entity/auth.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({
    type: AuthEntity,
  })
  login(
    @Body() { email, password }: LoginDto, //
  ) {
    return this.authService.login(email, password);
  }
}
