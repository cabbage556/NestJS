import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(
    private prismaService: PrismaService, //
  ) {}

  async createBookmark(
    userId: number,
    createBookmarkDto: CreateBookmarkDto,
  ) {
    const bookmark =
      await this.prismaService.bookmark.create({
        data: {
          ...createBookmarkDto,
          userId,
        },
      });

    return bookmark;
  }

  getBookmarks(userId: number) {
    return this.prismaService.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    return this.prismaService.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    editBookmarkDto: EditBookmarkDto,
  ) {
    // get the bookmark by id
    const bookmark =
      await this.prismaService.bookmark.findUnique({
        where: { id: bookmarkId },
      });
    // check if bookmark exists
    if (!bookmark)
      throw new ForbiddenException(
        'Access to resource denied',
      );
    // check if user owns the bookmark
    if (bookmark.userId !== userId)
      throw new ForbiddenException(
        'Access to resource denied',
      );

    return this.prismaService.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...editBookmarkDto,
      },
    });
  }

  async deleteBookmarkById(
    userId: number,
    bookmarkId: number,
  ) {
    const bookmark =
      await this.prismaService.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });
    if (!bookmark)
      throw new ForbiddenException(
        'Access to resource denied',
      );
    if (bookmark.userId !== userId)
      throw new ForbiddenException(
        'Access to resouce denied',
      );

    await this.prismaService.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
