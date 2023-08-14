import { Body, Controller, Post } from '@nestjs/common';
import { productsCategoriesService } from './productsCategories.service';
import { CreateProductCategoryDto } from './dto/create-productCategory.dto';
import ProductCategory from './model/productCategory.model';

@Controller('category')
export class ProductsCategoriesController {
  constructor(
    private readonly productsCategoriesService: productsCategoriesService, //
  ) {}

  @Post()
  createProductCategory(
    @Body() createProductCategoryDto: CreateProductCategoryDto, //
  ): Promise<ProductCategory> {
    return this.productsCategoriesService.create(createProductCategoryDto);
  }
}
