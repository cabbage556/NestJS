import {
  Column,
  DataType,
  Default,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Product } from 'src/products/model/product.model';

@Table
export class ProductSaleslocation extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column
  address: string;

  @Column
  addressDetail: string;

  @Column(DataType.DOUBLE)
  lat: number;

  @Column(DataType.DOUBLE)
  lng: number;

  @Column
  meetingTime: Date;

  @HasOne(() => Product)
  product: string;
}
