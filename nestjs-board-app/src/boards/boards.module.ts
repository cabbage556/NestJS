import { Module } from "@nestjs/common";
import { BoardsController } from "./boards.controller";
import { BoardsService } from "./boards.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Board } from "./board.model";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    AuthModule, //
    SequelizeModule.forFeature([Board]),
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
