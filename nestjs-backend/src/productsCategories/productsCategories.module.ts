import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import ProductCategory from './model/productCategory.model';
import { ProductsCategoriesController } from './productsCategories.controller';
import { productsCategoriesService } from './productsCategories.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProductCategory, //
    ]),
  ],
  controllers: [
    ProductsCategoriesController, //
  ],
  providers: [
    productsCategoriesService, //
  ],
  exports: [
    productsCategoriesService, //
  ],
})
export class ProductsCategoriesModule {}
