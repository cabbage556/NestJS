import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Article } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';

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

  @ApiPropertyOptional({
    nullable: true,
  })
  authorId: number | null;

  @ApiPropertyOptional({
    type: UserEntity,
  })
  author?: UserEntity;

  constructor({ author, ...data }: Partial<ArticleEntity>) {
    Object.assign(this, data);

    if (author) this.author = new UserEntity(author);
  }
}
