import { Injectable, Logger } from '@nestjs/common';
import { RequestService } from './request.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly requestService: RequestService) {}

  getHello(): string {
    const userId = this.requestService.getUserId(); // 미들웨어에서 RequestService 인스턴스에 저장했던 userId를 가져오기
    this.logger.log('getHello userId: ', userId);
    return 'Hello World!';
  }
}
