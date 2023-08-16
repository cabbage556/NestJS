import {
  BelongsTo,
  Column,
  DataType,
  DeletedAt,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import User from 'src/users/model/user.model';

export enum POINT_TRANSACTION_STATUS_ENUM {
  PAYMENT = 'PAYMENT',
  CANCEL = 'CANCEL',
}

@Table
export default class PointTransaction extends Model {
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
  impUid: string;

  @Column
  amount: number;

  @Column({
    type: DataType.ENUM(
      POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      POINT_TRANSACTION_STATUS_ENUM.CANCEL,
    ),
  })
  status: POINT_TRANSACTION_STATUS_ENUM;

  @DeletedAt
  deletedAt: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
