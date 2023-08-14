import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import Product from './model/product.model';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService, //
  ) {}

  @Post()
  createProduct(
    @Body(ValidationPipe) createProductDto: CreateProductDto, //
  ): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  getProducts(): Promise<Product[]> {
    return this.productsService.getProducts();
  }

  @Get('/:id')
  getProductById(
    @Param('id') id: string, //
  ): Promise<Product> {
    return this.productsService.getProductById(id);
  }

  @Patch('/:id')
  updateProduct(
    @Param('id') id: string, //
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete('/:id')
  deleteProduct(
    @Param('id') id: string, //
  ): Promise<boolean> {
    return this.productsService.deleteProduct(id);
  }
}
