import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateArticleDto {
  // title can't be empty or shorter than 5 characters
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @ApiProperty()
  title: string;

  // description has to have a maximum length of 300
  @IsOptional()
  @IsString()
  @MaxLength(300)
  @ApiPropertyOptional()
  description?: string;

  // body can't be empty
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  body: string;

  // published must be of type boolean
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    default: false,
  })
  published?: boolean = false;
}
