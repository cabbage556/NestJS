import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ArticleEntity } from './entities/article.entity';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  /**
   * POST /articles endpoint
   * @param createArticleDto article 생성 데이터
   * @returns 생성한 article 데이터
   */
  @Post()
  @ApiCreatedResponse({
    type: ArticleEntity,
  })
  async create(@Body() createArticleDto: CreateArticleDto) {
    return new ArticleEntity(
      await this.articlesService.create(createArticleDto),
    );
  }

  /**
   * GET /articles/drafts endpoint
   * route to fetch all unpublished articles
   */
  @Get('drafts')
  @ApiOkResponse({
    type: ArticleEntity,
    isArray: true,
  })
  async findDrafts() {
    const drafts = await this.articlesService.findDrafts();
    return drafts.map((draft) => new ArticleEntity(draft));
  }

  /**
   * GET /articles endpoint
   */
  @Get()
  @ApiOkResponse({
    type: ArticleEntity,
    isArray: true,
  })
  async findAll() {
    const articles = await this.articlesService.findAll();
    return articles.map((article) => new ArticleEntity(article));
  }

  /**
   * GET /articles/:id endpoint
   * @param id article id
   * @returns an article whose id is equal to the id param
   */
  @Get(':id')
  @ApiOkResponse({
    type: ArticleEntity,
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new ArticleEntity(await this.articlesService.findOne(id));
  }

  /**
   * PATCH /articles/:id endpoint
   * @param id article id
   * @param updateArticleDto article 수정 데이터
   * @returns 수정한 article 데이터
   */
  @Patch(':id')
  @ApiOkResponse({
    type: ArticleEntity,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return new ArticleEntity(
      await this.articlesService.update(id, updateArticleDto),
    );
  }

  /**
   * DELETE /articles/:id endpoint
   * @param id article id
   * @returns 삭제한 article 데이터
   */
  @Delete(':id')
  @ApiOkResponse({
    type: ArticleEntity,
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new ArticleEntity(await this.articlesService.remove(id));
  }
}
