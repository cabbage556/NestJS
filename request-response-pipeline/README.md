# NestJS 요청-응답 파이프라인

![](https://github.com/cabbage556/NestJS/assets/56855262/3d2ef7e4-cac3-4d12-a891-7932177fc940)

## 로깅

![](https://github.com/cabbage556/NestJS/assets/56855262/c0bc59a2-b5ee-4f98-b2fe-f20313432e57)

- 미들웨어 -> 가드 -> 라우트 핸들러 이전 인터셉터 -> 라우트 핸들러 -> 라우트 핸들러 이후 인터셉터

![](https://github.com/cabbage556/NestJS/assets/56855262/5195e599-c344-4a40-9338-972ad7df024c)

- 미들웨어 -> 가드 -> 라우트 핸들러 이전 인터셉터 -> 라우트 핸들러 HttpException 예외 던지기 -> HttpException 필터

![](https://github.com/cabbage556/NestJS/assets/56855262/787c36a5-8c2a-4ed8-b888-d430e6dc4364)

- 미들웨어 -> 가드 -> 라우트 핸들러 이전 인터셉터 -> 파이프 -> 라우트 핸들러 에러
