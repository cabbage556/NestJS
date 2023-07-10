import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { WeatherModule } from './weather/weather.module';
import config from './configs/config';

console.log(`실행 환경: ${process.env.NODE_ENV}`);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/envs/.${process.env.NODE_ENV}.env`,
      load: [config],
      cache: true,
      expandVariables: true, // 확장 변수 사용 설정
    }),
    WeatherModule, //
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
