import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard) // controller level guard
@Controller('bookmarks')
export class BookmarkController {
  constructor(
    private bookmarkService: BookmarkService, //
  ) {}

  @Post()
  createBookmark(
    @Body(new ValidationPipe())
    createBookmarkDto: CreateBookmarkDto, //
    @GetUser('id') userId: number,
  ) {
    return this.bookmarkService.createBookmark(
      userId,
      createBookmarkDto,
    );
  }

  @Get()
  getBookmarks(
    @GetUser('id') userId: number, //
  ) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: number, //
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(
      userId,
      bookmarkId,
    );
  }

  @Patch(':id')
  editBookmarkById(
    @GetUser('id') userId: number, //
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body(new ValidationPipe())
    editBookmarkDto: EditBookmarkDto,
  ) {
    return this.bookmarkService.editBookmarkById(
      userId,
      bookmarkId,
      editBookmarkDto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmarkById(
    @GetUser('id') userId: number, //
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(
      userId,
      bookmarkId,
    );
  }
}
