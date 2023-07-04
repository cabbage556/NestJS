import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from './multer.options';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 파일 업로드는 POST 메서드로만 가능하다. (Content-Type: multipart/form-data)
  // 인터셉터는 클라이언트와 서버 간의 요청과 응답 간에 로직을 추가하는 미들웨어이다.
  // FileInterceptor()는 클라이언트 요청에 따라 파일명이 file인 파일이 있는지 확인하고 함수의 인수로 넘겨준다.
  // FileInterceptor(폼필드이름, 옵션)
  @Post('file-upload')
  @UseInterceptors(FileInterceptor('file', multerOption)) // 파일 인터셉터
  fileUpload(
    // 인터셉터에서 준 파일을 받는다.
    // @UploadFile 데코레이터는 핸들러 함수의 매개변수 데코레이터로, 아규먼트로 넘겨진 값 중 file 객체를 지정해 꺼내는 역할을 한다.
    // 각 파일의 타입은 Express.Multer.File 타입이다.
    @UploadedFile() file: Express.Multer.File,
  ) {
    // 텍스트 파일은 버퍼에 바이너리값으로 저장되어 있다.
    // toString('utf-8')을 사용해 읽을 수 있는 글로 변환해준다.
    // console.log(file.buffer.toString('utf-8')); // 텍스트 파일 내용 출력
    console.log(file);

    return 'File Upload';
  }
}
