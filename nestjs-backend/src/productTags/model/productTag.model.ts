import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Product from 'src/products/model/product.model';
import ProductProductTag from 'src/products_productTags/model/product.productTag.model';

@Table
export default class ProductTag extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column
  name: string;

  @BelongsToMany(() => Product, () => ProductProductTag)
  products: Product[];
}
