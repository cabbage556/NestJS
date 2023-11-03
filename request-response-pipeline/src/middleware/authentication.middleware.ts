import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RequestService } from 'src/request.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthenticationMiddleware.name);

  // RequestService 의존성 주입
  constructor(private readonly requestService: RequestService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // 요청 응답 파이프라인에서 미들웨어 확인
    this.logger.log(AuthenticationMiddleware.name);

    // authenticate the user
    // ...
    const userId = '123';
    this.requestService.setUserID(userId);

    // 요청 진행
    next();
  }
}
