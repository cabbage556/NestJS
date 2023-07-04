import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // 초기화 함수 실행
    // ServeStaticModule.forRoot 함수를 실행하면 정적 파일을 서비스하는 ServeStaticModule이 초기화된다.
    ServeStaticModule.forRoot({
      // 실제 파일이 있는 디렉터리 파일 지정
      // 업로드한 파일이 저장되어 있는 경로를 설정한다.
      // 프로젝트의 최상위 디렉터리 바로 아래에 있는 [uploads] 디렉터리(chapter12/nest-file-upload/uploads)가 된다.
      rootPath: join(__dirname, '..', 'uploads'),
      // url 뒤에 붙을 경로를 지정
      // serveRoot 옵션이 없으면 업로드한 파일에 localhost:3000/{파일명}으로 접근할 수 있다.
      // 여기에서는 파일명과 API의 경로가 같다면 문제가 발생할 수 있다.
      // serveRoot 옵션에 경로를 추가해 localhost:3000/uploads/{파일명}으로 접근할 수 있다.
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
