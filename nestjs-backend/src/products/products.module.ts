import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import Product from './model/product.model';
import { ProductsSaleslocationsModule } from 'src/productsSaleslocations/productsSaleslocations.module';
import { ProductTagsModule } from 'src/productTags/productTags.module';
import { ProductsProductTagsModule } from 'src/products_productTags/productsProductTags.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Product]),
    ProductsSaleslocationsModule,
    ProductTagsModule,
    ProductsProductTagsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
