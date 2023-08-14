import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import ProductSaleslocation from './model/productSaleslocation.model';
import { ProductsSaleslocationsService } from './productsSaleslocations.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProductSaleslocation, //
    ]), //
  ],
  providers: [
    ProductsSaleslocationsService, //
  ],
  exports: [
    ProductsSaleslocationsService, //
  ],
})
export class ProductsSaleslocationsModule {}
