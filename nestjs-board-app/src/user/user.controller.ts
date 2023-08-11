import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.model";

@Controller("user")
export class UserController {
  constructor(
    private userService: UserService, //
  ) {}

  @Post()
  createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto, //
  ): Promise<User> {
    return this.userService.createUser(createUserDto);
  }
}
