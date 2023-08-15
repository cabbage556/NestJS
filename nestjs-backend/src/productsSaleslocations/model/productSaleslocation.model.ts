import {
  Column,
  DataType,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Product from 'src/products/model/product.model';

@Table
export default class ProductSaleslocation extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
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
