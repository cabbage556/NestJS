import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  body: string;

  @ApiPropertyOptional({
    default: false,
  })
  published?: boolean = false;
}
