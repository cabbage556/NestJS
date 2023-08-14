import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import ProductCategory from './model/productCategory.model';
import { CreateProductCategoryDto } from './dto/create-productCategory.dto';

@Injectable()
export class productsCategoriesService {
  constructor(
    @InjectModel(ProductCategory)
    private readonly productCategoryModel: typeof ProductCategory, //
  ) {}

  async create(
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategory> {
    try {
      const productCategory = await this.productCategoryModel.create({
        ...createProductCategoryDto,
      });
      return productCategory;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
