import {
  Column,
  DataType,
  HasMany,
  Index,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import PointTransaction from 'src/pointsTransactions/model/pointTransaction.model';

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

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  point: number;

  @HasMany(() => PointTransaction)
  pointTransactions: PointTransaction[];
}
