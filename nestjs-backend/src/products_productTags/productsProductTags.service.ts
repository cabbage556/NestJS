import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import ProductProductTag from './model/product.productTag.model';
import ProductTag from 'src/productTags/model/productTag.model';

@Injectable()
export class ProductsProductTagsService {
  constructor(
    @InjectModel(ProductProductTag)
    private readonly productProductTagModel: typeof ProductProductTag, //
  ) {}

  async create(
    productId: string,
    productTagId: string,
  ): Promise<ProductProductTag> {
    try {
      const productsProductTags = await this.productProductTagModel.create({
        productId,
        productTagId,
      });
      return productsProductTags;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async bulkInsert(
    productId: string,
    prevProductTags: ProductTag[],
    newProductTags: ProductTag[],
  ): Promise<void> {
    await this.productProductTagModel.bulkCreate(
      [...prevProductTags, ...newProductTags].map((tag) => {
        return {
          productId,
          productTagId: tag.id,
        };
      }),
    );
  }
}
