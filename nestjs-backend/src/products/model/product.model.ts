import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import ProductTag from 'src/productTags/model/productTag.model';
import ProductCategory from 'src/productsCategories/model/productCategory.model';
import ProductSaleslocation from 'src/productsSaleslocations/model/productSaleslocation.model';
import ProductProductTag from 'src/products_productTags/model/product.productTag.model';
import User from 'src/users/model/user.model';

@Table
export default class Product extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.INTEGER)
  price: number;

  @Default(false)
  @Column
  isSoldout: boolean;

  @DeletedAt
  deletedAt: Date;

  // 1:1
  @ForeignKey(() => ProductSaleslocation)
  @Column(DataType.UUID)
  productSaleslocationId: string;

  @BelongsTo(() => ProductSaleslocation)
  productSaleslocation: ProductSaleslocation;

  // 1:N
  @ForeignKey(() => ProductCategory)
  @Column(DataType.UUID)
  productCategoryId: string;

  @BelongsTo(() => ProductCategory)
  productCategory: ProductCategory;

  // 1:N
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @BelongsTo(() => User)
  user: User;

  // N:M
  @BelongsToMany(() => ProductTag, () => ProductProductTag)
  productTags: ProductTag[];
}
