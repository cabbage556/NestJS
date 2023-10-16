import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users endpoint
   * @param createUserDto 유저 생성 데이터
   * @returns 생성한 유저 데이터
   */
  @Post()
  @ApiCreatedResponse({
    type: UserEntity,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  /**
   * GET /users endpoint
   * @returns 유저 데이터 목록
   */
  @Get()
  @ApiOkResponse({
    type: UserEntity,
    isArray: true,
  })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  /**
   * GET /users/:id endpoint
   * @param id 유저 id
   * @returns 유저 데이터
   */
  @Get(':id')
  @ApiOkResponse({
    type: UserEntity,
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.findOne(id));
  }

  /**
   * PATCH /users/:id endpoint
   * @param id 유저 id
   * @param updateUserDto 유저 수정 데이터
   * @returns 수정한 유저 데이터
   */
  @Patch(':id')
  @ApiOkResponse({
    type: UserEntity,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  /**
   * DELETE /users/:id endpoint
   * @param id 유저 id
   * @returns 삭제한 유저 데이터
   */
  @Delete(':id')
  @ApiOkResponse({
    type: UserEntity,
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.remove(id));
  }
}
