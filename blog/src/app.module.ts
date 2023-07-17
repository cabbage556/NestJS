import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogFileRepository, BlogMongoRepository } from './blog.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/envs/.${process.env.NODE_ENV}.env`,
    }),
    // 몽고디비 연결 설정
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGODB_CLUSTER_ID}:${process.env.MONGODB_CLUSTER_PASSWORD}@${process.env.MONGODB_CLUSTER_INFO}/blog`, //
    ),
    // 몽고디비 스키마 설정
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogFileRepository, BlogMongoRepository], // 프로바이더 설정
})
export class AppModule {}
