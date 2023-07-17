import { readFile, writeFile } from 'fs/promises';
import { PostDto } from './blog.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blog.schema';
import { Model } from 'mongoose';

// 블로그 리포지토리 인터페이스 정의
export interface BlogRepository {
  getAllPost(): Promise<PostDto[]>;
  createPost(postDto: PostDto);
  getPost(id: string): Promise<PostDto>;
  deletePost(id: string);
  updatePost(id: string, postDto: PostDto);
}

// BlogRepository를 구현하는 클래스
// 파일에 쓰고 읽기
@Injectable()
export class BlogFileRepository implements BlogRepository {
  FILE_NAME = './src/blog.data.json';

  // 파일을 읽어서 모든 게시글 불러오기
  async getAllPost(): Promise<PostDto[]> {
    const data = await readFile(this.FILE_NAME, 'utf8');
    const posts = JSON.parse(data);
    return posts;
  }

  // 게시글 쓰기
  async createPost(postDto: PostDto) {
    const posts = await this.getAllPost();
    const id = posts.length + 1;
    const createPost = { id: id.toString(), ...postDto, createdDt: new Date() };
    posts.push(createPost);
    await writeFile(this.FILE_NAME, JSON.stringify(posts));
  }

  // 게시글 하나 가져오기
  async getPost(id: string): Promise<PostDto> {
    const posts = await this.getAllPost();
    const post = posts.find((post) => post.id === id);
    return post;
  }

  // 게시글 하나 삭제하기
  async deletePost(id: string) {
    const posts = await this.getAllPost();
    const filteredPosts = posts.filter((post) => post.id !== id);
    await writeFile(this.FILE_NAME, JSON.stringify(filteredPosts));
  }

  // 게시글 하나 수정하기
  async updatePost(id: string, postDto: PostDto) {
    const posts = await this.getAllPost();
    const index = posts.findIndex((post) => post.id === id);
    const updatePost = {
      id,
      ...posts[index],
      ...postDto,
      updatedDt: new Date(),
    };
    posts[index] = updatePost;
    await writeFile(this.FILE_NAME, JSON.stringify(posts));
  }
}

// 몽고디비 리포지토리
@Injectable()
export class BlogMongoRepository implements BlogRepository {
  constructor(
    // Model<BlogDocument> 타입인 blogModel 객체 주입
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>, //
  ) {}

  async getAllPost(): Promise<PostDto[]> {
    return await this.blogModel.find().exec();
  }

  createPost(postDto: PostDto) {
    const createPost = {
      ...postDto,
      createdDt: new Date(),
      updatedDt: new Date(),
    };
    this.blogModel.create(createPost);
  }

  async getPost(id: string): Promise<PostDto> {
    return await this.blogModel.findById(id);
  }

  async deletePost(id: string) {
    await this.blogModel.findByIdAndDelete(id);
  }

  async updatePost(_id: string, postDto: PostDto) {
    const updatePost = { ...postDto, updatedDt: new Date() };
    await this.blogModel.findByIdAndUpdate(_id, updatePost);
  }
}
