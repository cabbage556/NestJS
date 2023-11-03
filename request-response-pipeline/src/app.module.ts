import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestService } from './request.service';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { FreezePipe } from './pipes/freeze.pipe';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    RequestService,
    {
      provide: APP_GUARD, // AuthGuard에 의존성 주입이 필요한 경우, 이 방식으로 AuthGuard 사용 가능
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR, // LoggingInterceptor에 RequestService를 의존성 주입하므로 이 방식으로 사용 가능
      scope: Scope.REQUEST, // RequestService와 동일한 스코프 설정
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: FreezePipe,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  // 미들웨어를 주입하기 위한 NestModule 인터페이스 구현
  // configure 메서드 구현 필요
  configure(consumer: MiddlewareConsumer) {
    // consumer: 미들웨어 컨슈머
    // apply 메서드를 사용해 미들웨어 주입 가능
    // 모든 경로에 대해 미들웨어를 사용하기 위해 forRoutes 메서드에 * 전달
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}
