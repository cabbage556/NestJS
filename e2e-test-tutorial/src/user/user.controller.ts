import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import { EditUserDto } from './dto/edit-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService, //
  ) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(
    @GetUser() user: User, // 커스텀 데코레이터로 req 객체로부터 user 정보 가져오기
    @GetUser('id') id: number, // 커스텀 데코레이터에 user 정보(객체)의 필드를 전달하여 해당 필드만 뽑아올 수 있음
    @GetUser('email') email: string,
  ) {
    // 커스텀 데코레이터 동작 확인
    console.log({
      id,
      email,
    });
    return user;
  }

  @UseGuards(JwtGuard)
  @Patch()
  editUser(
    @GetUser('id') userId: number, //
    @Body(new ValidationPipe()) editUserDto: EditUserDto,
  ) {
    return this.userService.editUser(userId, editUserDto);
  }
}
