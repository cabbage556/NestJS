# NestJS로 웹 API 만들기(블로그 서비스)

## 프로젝트 생성 및 설정

프로젝트명: blog

```bash
nest new blog
```

nest-cli.json 파일

- `nest` 명령어로 프로젝트를 생성하거나 파일을 생성할 때 필요에 따라 수정
- 한 프로젝트 안에 여러 프로젝트를 함께 포함하는 모노 레포 등의 기능을 사용할 때 설정

프로젝트 정상 설치 확인

```bash
npm run start
```

실행 결과 확인

![](https://user-images.githubusercontent.com/56855262/253940150-488de805-0340-4333-831d-d388c6578b40.png)

## 컨트롤러 만들기

컨트롤러

- 클라이언트의 HTTP 요청을 어떤 코드에서 처리할지 정하는 역할
- HTTP 요청 시 헤더, URL 매개변수, 쿼리, 바디 등의 정보를 바탕으로 적절한 데코레이터가 붙어 있는 컨트롤러 코드가 실행됨
- NestJS에서 컨트롤러는 `<모듈명>.controller.ts` 라는 파일로 생성

src 디렉터리에 `blog.controller.ts`와 `blog.service.ts` 파일 추가

```ts
// src/blog.controller.ts
export class BlogController {}
```

```ts
// src/blog.service.ts
export class BlogService {}
```

`app.module.ts` 파일 수정

```ts
import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  imports: [],
  controllers: [BlogController],
  providers: [BlogService],
})
export class AppModule {}
```

## 블로그 API 작성

블로그 API

1. 모든 글 목록 가져오기
2. 글 작성하기
3. 게시글 하나 가져오기
4. 글 삭제하기
5. 글 수정하기

| URL 경로  | HTTP 메서드 | 설명                                 |
| --------- | ----------- | ------------------------------------ |
| /         | GET         | 모든 글 목록 가져오기                |
| /blog     | POST        | 글 작성하기                          |
| /blog/:id | PUT         | 게시글 아이디가 id인 게시글 수정     |
| /blog/:id | DELETE      | 게시글 아이디가 id인 게시글 삭제     |
| /blog/:id | GET         | 게시글 아이디가 id인 게시글 가져오기 |

컨트롤러는 URL 경로와 HTTP 속성들을 확인해 특정 코드를 실행시켜준다.

- NestJS에서 `@Controller` 데코레이터를 사용해 컨트롤러를 만든다.
- HTTP 메서드나 URL 속성도 모두 데코레이터로 표현할 수 있다.
  - GET 메서드 -> @Get
  - POST 메서드 -> @Post
  - PUT 메서드 -> @Put
  - DELETE 메서드 -> @Delete

`blog.controller.ts`에 라우트 핸들러들을 추가한다.

```ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('blog')
export class BlogController {
  @Get()
  getAllPosts() {
    console.log('모든 게시글 가져오기');
  }

  @Post()
  createPost(
    @Body() post: any, //
  ) {
    console.log('게시글 작성하기');
    console.log(post);
  }

  @Get('/:id')
  getPost(
    @Param('id') id: string, //
  ) {
    console.log(`${id} 게시글 하나 가져오기`);
  }

  @Delete('/:id')
  deletePost(
    @Param('id') id: string, //
  ) {
    console.log(`${id} 게시글 삭제하기`);
  }

  @Put('/:id')
  updatePost(
    @Param('id') id: string, //
    @Body() post: any,
  ) {
    console.log(`${id} 게시글 업데이트하기`);
    console.log(post);
  }
}
```

- `@nestjs/common`에 모든 데코레이터가 들어 있다.
- @Controller 데코레이터의 아규먼트로 URL 주소로 사용할 값을 전달한다.
  - 'blog'인 경우 URL 주소는 `{서버 주소}/blog`가 된다.
- 각 HTTP 메서드의 데코레이터의 아규먼트로 URL 주소로 사용할 값을 전달한다.
- `@Body`, `@Param`은 매개변수에 붙이는 데코레이터이다.
  - @Body: body로 오는 값을 매개변수에 할당한다.
  - @Param: URL의 패스 파라미터의 값을 매개변수에 할당한다.

## 메모리에 데이터를 저장하는 API 만들기

실제 비즈니스 로직은 `BlogService`에 담는다.

```ts
import { PostDto } from './blog.model';

export class BlogService {
  posts = [];

  getAllPosts() {
    return this.posts;
  }

  createPost(postDto: PostDto) {
    const id = this.posts.length + 1;
    this.posts.push({
      id: id.toString(),
      ...postDto,
      createdDt: new Date(),
    });
  }

  getPost(id: string) {
    const post = this.posts.find((post) => post.id === id);
    console.log(post);
    return post;
  }

  delete(id: string) {
    const filteredPosts = this.posts.filter((post) => post.id !== id);
    this.posts = [...filteredPosts];
  }

  updatePost(id: string, postDto: PostDto) {
    const updateIndex = this.posts.findIndex((post) => post.id === id);
    const updatePost = { id, ...postDto, updatedDt: new Date() };
    this.posts[updateIndex] = updatePost;
    return updatePost;
  }
}
```

블로그 게시글의 타입을 정의한다.

```ts
// src/blog.model.ts
export interface PostDto {
  id: string;
  title: string;
  content: string;
  name: string;
  createdDt: Date;
  updatedDt?: Date;
}
```

- `PostDto`는 게시글의 데이터를 나타내는 타입이다.
- 타입스크립트에서는 데이터만 가지고 있는 타입은 클래스보다 인터페이스를 사용해 선언한다.
- id, title, content, name, createdDt 필드를 가지며 null이 아닌 값들이다. (필수값)
- updatedDt는 수정일시로 수정일시는 null이 될 수 있으므로 뒤에 `?`를 붙인다. (필수값이 아님)

작성한 BlogService API를 컨트롤러에서 사용할 수 있게 컨트롤러를 수정한다.

```ts
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
  blogService: BlogService;

  constructor() {
    // 생성자에서 BlogService 객체 생성
    this.blogService = new BlogService();
  }

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
```

- `BlogService`를 사용하기 위해 클래스 생성자에서 클래스 멤버 변수 `blogService`에 인스턴스를 생성하여 할당한다.

`REST Client`로 결과를 확인한다.(src/blog.http)

```
@server = http://localhost:3000

### 게시글 생성
POST {{server}}/blog
Content-Type: application/json

{
    "title": "안녕하세요",
    "content": "NestJS입니다",
    "name": "NestJS"
}

### 특정 게시글 조회
GET {{server}}/blog/1

### 게시글 수정
PUT {{server}}/blog/1
Content-Type: application/json

{
    "title": "제목 수정 중..",
    "content": "본문 수정 중..",
    "name": "cabbage"
}

### 특정 게시글 조회
GET {{server}}/blog/1

### 게시글 삭제
DELETE {{server}}/blog/1

### 전체 게시글 조회
GET {{server}}/blog
```

## 파일에 정보를 저장하도록 API 업그레이드하기

메모리에 정보를 저장하면 서버를 재실행할 때마다 작성한 내용이 모두 사라진다. 이 문제를 해결하려면 파일이나 데이터베이스에 정보를 저장해야 한다.

- 이를 아키텍처 관점에서 `영속성 계층`이라고 한다.

블로그의 영속성 계층 코드인 리포지토리를 구현한다.

```ts
import { readFile, writeFile } from 'fs/promises';
import { PostDto } from './blog.model';

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
```

src 디렉터리에 `blog.data.json` 파일을 추가하고 초기값으로 []을 설정한다.

```json
[]
```

서비스 파일이 리포지토리를 사용하는 로직으로 수정한다.

```ts
import { PostDto } from './blog.model';
import { BlogFileRepository, BlogRepository } from './blog.repository';

export class BlogService {
  blogRepository: BlogRepository;

  constructor() {
    this.blogRepository = new BlogFileRepository();
  }

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
```

# 의존성 주입하기

현재 컨트롤러, 서비스, 리포지토리는 의존 관계이다.

- 컨트롤러는 서비스의 인스턴스를 생성자에서 직접 생성해 사용한다.
- 서비스는 리포지토리의 인스턴스를 생성자에서 직접 생성해 사용한다.

`제어의 역전(Inversion Of Control) 원칙`을 사용하면 인스턴스를 직접 생성하지 않고 다른 곳에서 생성한 인스턴스를 가져다 사용할 수 있다.

- 프레임워크에게 인스턴스 생성을 맡긴다.
- 제어의 역전 원칙을 사용해 만든 패턴이 `의존성 주입`이다.
- 개발자가 인스턴스를 직접 생성하지 않고 프레임워크가 생성한 컨테이너 의존성을 관리해준다.

NestJS에서 의존성 주입하는 방법

- 주입하고 싶은 클래스에 `@Injectable` 데코레이터를 붙인다.
- @Injectable 데코레이터를 붙여 다른 클래스에 주입해 사용하는 클래스들을 `프로바이더(provider)`라고 부른다.

리포지토리와 서비스에 @Injectable 데코레이터를 추가하고, 컨트롤러와 서비스의 생성자에서 의존성 객체를 직접 생성하지 않고 선언만 하도록 변경한다.

```ts
// src/blog.repository.ts
@Injectable()
export class BlogFileRepository implements BlogRepository {
  ...
}
```

```ts
// src/blog.service.ts
@Injectable()
export class BlogService {
  constructor(
    private blogRepository: BlogFileRepository, // 생성자를 통해 의존성 주입
  ) {}
  ...
}
```

- 클래스의 생성자에 매개변수로 선언된 타입이 프로바이더로 설정된 타입이라면 NestJS에서 자동으로 필요한 객체를 주입해준다.
- BlogRepository는 인터페이스이기 때문에 객체를 생성할 수 없으므로 의존성 주입을 할 수 없다.
- 따라서 의존성 주입을 할 때는 실제로 사용할 클래스 타입으로 설정한다.

컨트롤러도 수정한다.

```ts
// src/blog.controller.ts
@Controller('blog')
export class BlogController {
  constructor(
    private blogService: BlogService, // 생성자를 통해 의존성 주입
  ) {}

  ...
}
```

마지막으로 모듈도 수정한다.

```ts
// src/app.module.ts
@Module({
  imports: [],
  controllers: [BlogController],
  providers: [BlogService, BlogFileRepository], // 프로바이더 설정
})
export class AppModule {}
```

- BlogService, BlogFileRepository에 @Injectable 데코레이터를 추가하여 프로바이더로 만들었으므로 앱이 실행될 때 의존성 주입을 하도록 클래스 정보를 추가한다.

# 몽고디비 연동하기

NestJS에서 몽기디비 연동하는 방법 두 가지

1. TypeORM을 사용해 connector를 몽고디비로 사용하기
2. Mongoose를 사용하기

## 의존성 설치

```bash
npm i @nestjs/mongoose mongoose
```

## 스키마 만들기

RDB의 테이블과 비슷한 역할을 하는 스키마를 만든다.

- `@Schema` 데코레이터를 사용한다.

```ts
// src/blog.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Blog 타입이면서 몽고디비의 도큐먼트로 사용할 수 있는 BlogDocument 타입 정의
export type BlogDocument = Blog & Document;

@Schema()
export class Blog {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  name: string;

  @Prop()
  createdDt: Date;

  @Prop()
  updatedDt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog); // 스키마 생성
```

- `&`를 사용하는 교차 타입을 사용해 블로그 타입이면서 몽고디비의 도큐먼트로 사용할 수 있는 `BlogDocument` 타입을 정의한다.
- `&`를 사용하는 교차 타입은 `Blog`와 `Document`의 모든 프로퍼티를 가지고 있어야 한다.
- `mongoose`를 사용하려면 스키마를 통해 만들어질 모델을 정의해야 한다.
  - `@Schema` 데코레이터를 사용한다.
- `@Prop` 데코레이터는 모델의 프로퍼티임을 나타낸다.
- `SchemaFactory.createForClass` 메서드를 사용해 스키마를 생성한다.

## 몽고디비를 사용하는 리포지토리 추가하기

몽고디비를 위한 `BlogMongoRepository`를 추가한다.

```ts
// src/blog.repository.ts

import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blog.schema';
import { Model } from 'mongoose';

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

  async updatePost(id: string, postDto: PostDto) {
    const updatePost = { id, ...postDto, updatedDt: new Date() };
    await this.blogModel.findByIdAndUpdate(id, updatePost);
  }
}
```

- `BlogRepository` 인터페이스를 구현한 `BlogMongoRepository` 클래스를 추가한다.
  - 서비스에서 인터페이스를 사용하면 코드를 많이 수정하지 않고 사용할 수 있는 장점이 있다.
- `@InjectModel` 데코레이터를 사용해 읽기, 쓰기, 수정, 삭제 메서드를 가지고 있는 모델을 주입받는다.

## 서비스 코드 변경

서비스의 리포지토리 의존성 주입 코드만 수정하면 된다.

```ts
import { BlogMongoRepository } from './blog.repository';

@Injectable()
export class BlogService {
  constructor(
    private blogRepository: BlogMongoRepository, // 생성자를 통해 의존성 주입
  ) {}

  ...
}
```

## 모듈에 몽고 디비 연결 설정과 프로바이더 설정 추가하기

모듈에 몽고 디비 연결 설정과 프로바이더 설정을 추가한다.

```ts
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
```

- `MongooseModule.forRoot` 메서드를 사용해 몽고디비 연결을 설정한다.
  - 마지막에 `blog`를 넣어 블로그에 해당하는 데이터베이스를 생성한다.
- `MongooseModule.forFeature` 메서드를 사용해 스키마를 설정한다.
  - `name` 항목에 이름을, `schema` 항목에 `BlogSchema`를 넣는다.
- 몽고디비 리포지토리를 프로바이더 설정에 추가하여 의존성 주입할 수 있게 한다.

테스트 결과 확인

![](https://user-images.githubusercontent.com/56855262/253981418-4a2d7a82-cf52-479b-aea3-d6981f1065b3.png)
