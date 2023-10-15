import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Article } from '@prisma/client';

export class ArticleEntity implements Article {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional({
    nullable: true,
  })
  description: string | null;

  @ApiProperty()
  body: string;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
