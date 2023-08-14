import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import ProductTag from './model/productTag.model';
import { ProductTagsService } from './productTags.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProductTag, //
    ]),
  ],
  providers: [
    ProductTagsService, //
  ],
  exports: [
    ProductTagsService, //
  ],
})
export class ProductTagsModule {}
