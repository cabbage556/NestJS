import {
  BelongsToMany,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Product from 'src/products/model/product.model';
import ProductProductTag from 'src/products_productTags/model/product.productTag.model';

@Table
export default class ProductTag extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column
  name: string;

  @BelongsToMany(() => Product, () => ProductProductTag)
  products: Product[];
}
