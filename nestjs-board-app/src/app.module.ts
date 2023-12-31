import { Module } from "@nestjs/common";
import { BoardsModule } from "./boards/boards.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { sequelizeConfig } from "./configs/sequelize.config";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    AuthModule, //
    BoardsModule,
    SequelizeModule.forRoot(sequelizeConfig),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
