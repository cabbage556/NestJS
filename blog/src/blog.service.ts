import { Injectable } from '@nestjs/common';
import { PostDto } from './blog.model';
import { BlogMongoRepository } from './blog.repository';

@Injectable()
export class BlogService {
  constructor(
    private blogRepository: BlogMongoRepository, // 생성자를 통해 의존성 주입
  ) {}

  async getAllPosts() {
    return this.blogRepository.getAllPost();
  }

  createPost(postDto: PostDto) {
    this.blogRepository.createPost(postDto);
  }

  async getPost(id: string) {
    return this.blogRepository.getPost(id);
  }

  delete(id: string) {
    this.blogRepository.deletePost(id);
  }

  updatePost(id: string, postDto: PostDto) {
    this.blogRepository.updatePost(id, postDto);
  }
}
