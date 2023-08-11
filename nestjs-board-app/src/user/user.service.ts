import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User, //
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userModel.create({ ...createUserDto });
    return user;
  }

  async getUserByName(name: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { name } });
    return user;
  }
}
