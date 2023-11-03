import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  examplePost(@Body() body: any) {
    // FreezePipe에 의해 에러 발생 프로퍼티를 추가하거나 수정할 수 없음
    body.test = 32;
  }

  @Get('error')
  throwHttpException() {
    throw new InternalServerErrorException();
  }
}
