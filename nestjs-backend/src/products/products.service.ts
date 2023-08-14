import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Product from './model/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsSaleslocationsService } from 'src/productsSaleslocations/productsSaleslocations.service';
import ProductSaleslocation from 'src/productsSaleslocations/model/productSaleslocation.model';
import ProductCategory from 'src/productsCategories/model/productCategory.model';
import { ProductTagsService } from 'src/productTags/productTags.service';
import { ProductsProductTagsService } from 'src/products_productTags/productsProductTags.service';
import ProductTag from 'src/productTags/model/productTag.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product, //
    private readonly productsSaleslocationsService: ProductsSaleslocationsService,
    private readonly productTagsService: ProductTagsService,
    private readonly productsProductTagsService: ProductsProductTagsService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const {
        createProductSaleslocationDto,
        productCategoryId,
        productTags,
        ...productInfo
      } = createProductDto;

      const { id: productSaleslocationId } =
        await this.productsSaleslocationsService.create(
          createProductSaleslocationDto,
        );

      const product = await this.productModel.create({
        ...productInfo,
        productSaleslocationId,
        productCategoryId,
      });

      const prevProductTags = await this.productTagsService.findTagsByName(
        productTags,
      );
      const newTags = this.productTagsService.removePrevTagsFromProductTags(
        prevProductTags,
        productTags,
      );
      const newProductTags = await this.productTagsService.bulkInsert(newTags);

      this.productsProductTagsService.bulkInsert(
        product.id,
        prevProductTags,
        newProductTags,
      );

      return product;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  getProducts(): Promise<Product[]> {
    return this.productModel.findAll({
      include: [ProductSaleslocation, ProductCategory, ProductTag],
    });
  }

  async getProductById(id: string): Promise<Product> {
    return this.productModel.findOne({
      where: { id },
      include: [ProductSaleslocation, ProductCategory, ProductTag],
    });
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.getProductById(id);
    if (!product) {
      throw new NotFoundException('product not founded');
    }

    this.checkSoldout(product.isSoldout);

    await product.update({ ...updateProductDto });
    return product;
  }

  checkSoldout(isSoldout: boolean): void {
    if (isSoldout) {
      throw new UnprocessableEntityException('product already soldout');
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    // deletedAt 칼럼 - softDelete
    const result = await this.productModel.destroy({
      where: { id },
    });
    return result === 1;
  }
}
