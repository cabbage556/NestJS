import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./get-user.decorator";
import { User } from "src/user/user.model";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService, //
  ) {}

  @Post("/signUp")
  signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto, //
  ): Promise<User> {
    return this.authService.signUp(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/signIn")
  signIn(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto, //
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialDto);
  }

  @Post("/test")
  @UseGuards(AuthGuard())
  test(
    @GetUser() user: User, //
  ) {
    console.log(user);
  }
}
