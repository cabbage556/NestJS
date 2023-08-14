import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import ProductSaleslocation from './model/productSaleslocation.model';
import { CreateProductSaleslocationDto } from './dto/create-productSaleslocation.dto';

@Injectable()
export class ProductsSaleslocationsService {
  constructor(
    @InjectModel(ProductSaleslocation)
    private readonly productSaleslocationModel: typeof ProductSaleslocation, //
  ) {}

  async create(
    createProductSaleslocationDto: CreateProductSaleslocationDto,
  ): Promise<ProductSaleslocation> {
    const productSaleslocation = await this.productSaleslocationModel.create({
      ...createProductSaleslocationDto,
    });
    return productSaleslocation;
  }
}
