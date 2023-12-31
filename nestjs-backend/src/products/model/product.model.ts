import {
  AfterCreate,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
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

  @Column({
    defaultValue: false,
  })
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

  // Hooks(트리거)
  @AfterCreate
  static consoleLog(instance: Product) {
    // 테이블에 레코드 저장 후 저장된 레코드를 받아 콘솔에 출력
    console.log('---------Hook---------');
    console.log(instance);
    console.log('---------Hook---------');
  }
}
