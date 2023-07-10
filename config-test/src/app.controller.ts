import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private configService: ConfigService, // ConfigService 의존성 주입
  ) {}

  @Get()
  getHello(): string {
    // get 메서드 호출
    const message = this.configService.get('MESSAGE');
    return message;
  }

  @Get('service-url')
  getServiceUrl(): string {
    return this.configService.get('SERVICE_URL');
  }

  @Get('db-info')
  getDbInfo(): string {
    console.log(this.configService.get('logLevel'));
    console.log(this.configService.get('apiVersion'));
    return this.configService.get('dbInfo');
  }

  @Get('redis-info')
  getRedisInfo(): string {
    return `${this.configService.get('redis.host')}:${this.configService.get(
      'redis.port',
    )}`;
  }

  @Get('server-url')
  getServerUrl(): string {
    return this.configService.get('SERVER_URL');
  }
}
