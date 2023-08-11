import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { BoardStatus } from "./board-status.enum";
import { User } from "src/user/user.model";

// 게시글 모델(테이블)
@Table
export class Board extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column
  title: string;

  @Column
  contents: string;

  @Column({
    type: DataType.ENUM(BoardStatus.PUBLIC, BoardStatus.PRIVATE),
  })
  status: BoardStatus;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
