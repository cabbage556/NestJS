import { Injectable, NotFoundException } from "@nestjs/common";
import { Board } from "./board.model";
import { CreateBoardDto } from "./dto/create-board.dto";
import { InjectModel } from "@nestjs/sequelize";
import { BoardStatus } from "./board-status.enum";
import { User } from "src/user/user.model";

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board)
    private boardModel: typeof Board, //
  ) {}

  getAllBoards(): Promise<Board[]> {
    return this.boardModel.findAll();
  }

  async getMyBoards(user: User): Promise<Board[]> {
    const myBoards = await this.boardModel.findAll({
      where: { userId: user.id },
    });
    return myBoards;
  }

  async getBoardById(id: string): Promise<Board> {
    const board = await this.boardModel.findOne({ where: { id } });
    return board;
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, contents } = createBoardDto;
    const board = await this.boardModel.create({
      title,
      contents,
      status: BoardStatus.PUBLIC,
      userId: user.id,
    });

    return board;
  }

  async deleteBoard(id: string, user: User): Promise<void> {
    const result = await this.boardModel.destroy({
      where: { id, userId: user.id },
    });
    if (result !== 1) {
      throw new NotFoundException("board not founded");
    }
  }

  async updateBoardStatus(id: string, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);
    if (!board) {
      throw new NotFoundException("board not founded");
    }
    await board.update({ status });

    return board;
  }
}
