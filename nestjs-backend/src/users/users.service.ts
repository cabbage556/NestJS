import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import User from './model/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User, //
  ) {}

  getUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.getUserByEmail(createUserDto.email);
    if (user) {
      throw new ConflictException('user already exists');
    }

    try {
      const salts = await bcrypt.genSalt(5);
      const hashedPassword = await bcrypt.hash(createUserDto.password, salts);
      const createdUser = await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
      });
      createdUser.password = null;
      return createdUser;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
