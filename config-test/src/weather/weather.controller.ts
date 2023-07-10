import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('weather')
export class WeatherController {
  constructor(
    private configService: ConfigService, // ConfigService 의존성 주입
  ) {}

  @Get()
  getWeather(): string {
    // 환경 변수 값 가져오기
    const apiUrl = this.configService.get('WEATHER_API_URL');
    const apiKey = this.configService.get('WEATHER_API_KEY');

    return this.callWeahterApi(apiUrl, apiKey);
  }

  private callWeahterApi(apiUrl: string, apiKey: string): string {
    console.log('날씨 정보 가져오는 중...');
    console.log(apiUrl);
    console.log(apiKey);
    return '내일은 더움';
  }
}
