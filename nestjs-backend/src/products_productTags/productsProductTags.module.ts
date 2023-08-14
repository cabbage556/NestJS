import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import ProductProductTag from './model/product.productTag.model';
import { ProductsProductTagsService } from './productsProductTags.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProductProductTag, //
    ]),
  ],
  providers: [
    ProductsProductTagsService, //
  ],
  exports: [
    ProductsProductTagsService, //
  ],
})
export class ProductsProductTagsModule {}
