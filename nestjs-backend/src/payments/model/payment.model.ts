import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table
export default class Payment extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column
  amount: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  tax: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  commission: number;
}
