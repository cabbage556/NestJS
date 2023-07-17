import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { PostDto } from './blog.model';

@Controller('blog')
export class BlogController {
  constructor(
    private blogService: BlogService, //
  ) {}

  @Get()
  getAllPosts() {
    console.log('모든 게시글 가져오기');
    return this.blogService.getAllPosts();
  }

  @Post()
  createPost(
    @Body() postDto: PostDto, //
  ) {
    console.log('게시글 작성하기');
    this.blogService.createPost(postDto);
    return 'success';
  }

  @Get('/:id')
  getPost(
    @Param('id') id: string, //
  ) {
    console.log(`${id} 게시글 하나 가져오기`);
    return this.blogService.getPost(id);
  }

  @Delete('/:id')
  deletePost(
    @Param('id') id: string, //
  ) {
    console.log(`${id} 게시글 삭제하기`);
    this.blogService.delete(id);
    return 'success';
  }

  @Put('/:id')
  updatePost(
    @Param('id') id: string, //
    @Body() postDto: PostDto,
  ) {
    console.log(`${id} 게시글 업데이트하기`);
    return this.blogService.updatePost(id, postDto);
  }
}
