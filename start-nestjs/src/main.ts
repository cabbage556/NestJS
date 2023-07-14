import { NestFactory } from "@nestjs/core";
import { HelloModule } from "./hello.module";

// NestJS 앱 시작 함수
async function bootstrap() {
    // NestFactory를 사용해 NestApplication 객체 생성
    const app = await NestFactory.create(HelloModule);

    // 3000번 포트로 서버 기동
    await app.listen(3000, () => console.log("서버 시작"));
}

bootstrap();
