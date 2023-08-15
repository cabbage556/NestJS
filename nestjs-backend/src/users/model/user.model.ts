import {
  Column,
  DataType,
  Index,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table
export default class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Index({
    type: 'UNIQUE',
    unique: true,
  })
  @Column
  email: string;

  @Column
  password: string;

  @Column
  name: string;

  @Column
  age: number;
}
