import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { RequestService } from 'src/request.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor(private readonly requestService: RequestService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 📌📌📌라우트 핸들러 이전 인터셉터📌📌📌
    const request = context.switchToHttp().getRequest(); // request 객체에 접근 가능
    // request 객체에서 로그를 남길 정보들을 가져오기
    const userAgent = request.get('user-agent') || '';
    const { ip, method, path: url } = request;

    // 요청 로그 남기기
    this.logger.log(
      `${method} ${url} ${userAgent} ${ip}: ${context.getClass().name} ${
        context.getHandler().name
      } invoked..`,
    );

    // 디버깅 로그 남기기
    this.logger.debug(`userId: ${this.requestService.getUserId()}`);

    const now = Date.now(); // 라우트 핸들러에서 요청을 처리하기 전 시간

    // 📌📌📌라우트 핸들러 이후 인터셉터📌📌📌
    return next.handle().pipe(
      // 라우트 핸들러의 응답 이후 실행
      // 라우트 핸들러의 응답에 접근 가능
      tap((res) => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const contentLength = response.get('content-length');

        // 응답 로그 남기기
        this.logger.log(
          `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}: ${
            Date.now() - now
          }ms`,
        );
        this.logger.debug('Response: ', res);
      }),
    );
  }
}
