import { IsString, Min } from 'class-validator';
import { CreateProductSaleslocationDto } from 'src/productsSaleslocations/dto/create-productSaleslocation.dto';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Min(0)
  price: number;

  createProductSaleslocationDto: CreateProductSaleslocationDto;
  productCategoryId: string;
  productTags: string[];
}
