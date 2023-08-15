import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import User from './model/user.model';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/commons/get-user.decorator';
import { IGetUser } from 'src/commons/interfaces/get-user.decorator.interface';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  @Post()
  createUser(
    @Body() createUserDto: CreateUserDto, //
  ): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('access'))
  @Get()
  getUser(
    @GetUser() user: IGetUser, //
  ): string {
    console.log(user);
    return '인가에 성공하였습니다.';
  }
}
