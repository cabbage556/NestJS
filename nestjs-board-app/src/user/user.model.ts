import {
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { Board } from "src/boards/board.model";

@Table
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Unique // 유니크 칼럼 설정
  @Column
  name: string;

  @Column
  password: string;

  @HasMany(() => Board)
  board: Board[];
}
