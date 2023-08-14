import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import ProductTag from 'src/productTags/model/productTag.model';
import Product from 'src/products/model/product.model';

@Table
export default class ProductProductTag extends Model {
  @ForeignKey(() => Product)
  @Column(DataType.UUID)
  productId: string;

  @ForeignKey(() => ProductTag)
  @Column(DataType.UUID)
  productTagId: string;
}
