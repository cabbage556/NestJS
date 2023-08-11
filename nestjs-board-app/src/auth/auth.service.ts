import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { User } from "src/user/user.model";

@Injectable()
export class AuthService {
  constructor(
    private userSerivce: UserService, //
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userSerivce.getUserByName(createUserDto.name);
    if (user) {
      throw new BadRequestException("existing user name");
    }

    const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);
    try {
      const user = await this.userSerivce.createUser({
        ...createUserDto,
        password: hashedPassword,
      });
      user.password = null;
      return user;
    } catch (err) {
      throw new InternalServerErrorException("server error");
    }
  }

  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    const { name, password } = authCredentialDto;
    const user = await this.validateUser(name, password);
    if (!user) {
      throw new BadRequestException("user not founded or password not matched");
    }

    return {
      accessToken: this.generateAccessToken(user.name),
    };
  }

  async validateUser(name: string, password: string): Promise<User> {
    const user = await this.userSerivce.getUserByName(name);
    if (!user) {
      return null;
    }

    const { password: hashedPassword } = user;
    const isPasswordMatched = bcrypt.compareSync(password, hashedPassword);
    if (!isPasswordMatched) {
      return null;
    }

    return user;
  }

  generateAccessToken(name: string): string {
    const payload = { name };
    return this.jwtService.sign(payload);
  }
}
