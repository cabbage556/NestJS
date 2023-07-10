# NestJS 환경 변수 설정하기

## ConfigModule

- NestJS에서 환경 변수 설정에 필요한 모듈
- 환경 설정에 특화된 기능을 하는 모듈
- `@nestjs/config` 패키지에 포함된 클래스
- 모든 환경 변수 설정은 이 모듈에서 시작

### ConfigModule 초기화 순서

1. 일반적으로 app.module.ts에서 `forRoot` 메서드로 ConfigModule 초기화를 진행한다.
2. ConfigModule 초기화 시 `envFilePath` 옵션의 설정에서 환경 변수를 읽고 `process.env`에 설정되어 있는 환경 변수와 합친다.
3. 마지막으로 커스텀 환경 변수를 설정한 `load` 옵션의 설정과 합친다.
4. 이후 `ConfigService`를 초기화한다.

`ConfigService`는 다른 모듈에 의존성 주입하여 사용할 수 있다.

### 필요한 패키지 설치

```bash
npm i @nestjs/config
```

`@nestjs/config`

- 내부적으로 `dotenv`를 사용하는 의존성 패키지
- `dotenv` 패키지는 `.env` 파일에서 환경 변수를 설정하고 불러올 수 있게 해주는 라이브러리

### app.module.ts에 ConfigModule 설정하기

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // ConfigModule 초기화
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- `forRoot` 메서드에 아무런 옵션을 추가하지 않아도 NestJS에서 환경 변수를 사용할 수 있다.
- `forRoot` 메서드를 호출하여 ConfigModule을 초기화한다.

`ConfigModule.forRoot` 메서드의 옵션들

- `cache`: 메모리 환경 변수를 캐시할지 여부. 애플리케이션 성능을 향상시킨다.
- `isGlobal`: true로 설정하면 글로벌 모듈로 등록되어 다른 모듈에서 임포트하지 않아도 된다.
- `ignoreEnvFile`: true이면 .env 파일을 무시한다.
- `ignoreEnvVars`: true이면 환경 변수가 무효화된다.
- `envFilePath`: 환경 변수 파일들의 경로
- `encoding`: 환경 변수 파일의 인코딩 방식
- `validate`: 환경 변수의 유효성 검증 함수
- `load`: 커스텀 환경 설정 파일을 로딩 시 사용한다.(ts, YAML 파일 등)

### .env 파일 생성

.env 파일

- @nestjs/config 내부에서 사용하는 dotenv 라이브러리가 환경 변수 파일을 읽을 때 사용하는 파일
- dotenv 라이브러리는 기본적으로 .env 파일을 읽어온다.
- 환경 변수를 키-값으로 저장하는 파일이다.
- 가장 간단한 환경 변수 설정 방법이다.

프로젝트 루트 디렉터리에 .env 파일을 생성한다.

```
MESSAGE=hello NestJS # .env의 환경 변수 MESSAGE
```

- 환경 변수의 키는 일반적으로 대문자로 작성한다.

### app.controller.ts에서 환경 변수 확인하기

```typescript
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
}
```

- AppController 생성자에 ConfigService를 의존성 주입한다.
- ConfigService의 get 메서드를 사용해 환경 변수의 키 'MESSAGE'에 해당하는 값을 읽어 온다.

결과 확인

![](https://user-images.githubusercontent.com/56855262/252330720-0b5ea30d-e7eb-4bad-85f1-de6abb1f02a1.png)

## ConfigModule 전역 모듈로 설정하기

> forRoot 메서드의 `isGlobal` 옵션으로 `ConfigModule`을 전역 모듈로 설정할 수 있다.

환경 변수를 읽어오기 위해 `ConfigService`를 사용한다. `ConfigService`를 사용하기 위해 의존성 주입하려면 의존성 주입이 필요한 모듈에 `ConfigModule`을 초기화해줘야 한다.(@Module 데코레이터의 imports 옵션에서 `forRoot` 메서드로 초기화)

하지만 큰 프로젝트일수록 모듈의 갯수는 많아지기 때문에 `ConfigModule`이 필요한 모듈들에 일일이 `ConfigModule`을 임포트하기가 어려워진다.

`forRoot` 메서드의 `isGlobal` 옵션을 사용해 `ConfigModule`을 전역 모듈로 설정하면 다른 모듈들에 `ConfigModule`을 일일이 임포트하지 않아도 된다.

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 설정
    }), //
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- `isGlobal: true`를 설정하면 ConfigModule이 전역 모듈로 등록되어 다른 모듈에 임포트하지 않아도 된다.

다른 모듈에서 환경 변수 값을 확인하기 전에 먼저 .env 파일에 환경 변수를 추가한다.

```
MESSAGE=hello NestJS
WEATHER_API_URL=http://api.openweathermap.org/data/2.5
WEATHER_API_KEY=my_weather_api_key
```

### weather 모듈 추가하기

```bash
nest g module weather
nest g controller weather --no-spec
```

```typescript
import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';

@Module({
  controllers: [WeatherController],
})
export class WeatherModule {}
```

- ConfigModule이 전역 모듈로 등록되었다.
- WeatherModule에 ConfigModule을 임포트하지 않는다.

### weather 컨트롤러에 라우트 핸들러 함수 추가 후 테스트

```typescript
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
```

- ConfigService를 의존성 주입하고 get 메서드를 사용해 환경 변수 값을 가져온다.

결과 확인

![](https://user-images.githubusercontent.com/56855262/252334795-baa981fa-20b7-4467-945e-7ee016ddab99.png)

## 여러 환경 변수 파일 사용하기

현업에서는 여러 환경 변수를 사용한다.

- dev: 개발용
- qa: QA용
- beta: 베타 서비스용
- prod: 실제 서비스용

Node.js에서는 `NODE_ENV` 환경 변수에 용도별 환경 변수를 정의해 사용한다.

- 서버 실행 시 사용하는 명령어를 수정해 `NODE_ENV`에 값을 할당해 실행 환경 별로 서버 설정을 다르게 적용할 수 있다.

### 실행 환경별로 서버가 실행되도록 스크립트 수정하기

서버의 실행 환경을 설정하려면 package.json의 `scripts` 항목에 스크립트를 추가해야 한다.

```json
"scripts": {
    ...
    "start": "NODE_ENV=local nest start",
    "start:dev": "NODE_ENV=dev nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "NODE_ENV=prod node dist/main",
    ...
}
```

- MacOS와 리눅스 설정
- `NODE_ENV={서버실행환경}` 형식으로 서버 실행 환경에 따라 `NODE_ENV`에 값을 할당한다.

앱 모듈에 `NODE_ENV` 값을 확인하는 코드를 추가한다.

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { WeatherModule } from './weather/weather.module';

console.log(`실행 환경: ${process.env.NODE_ENV}`); // 서버 실행 시 NODE_ENV 환경 변수 값 출력

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 설정
    }),
    WeatherModule, //
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- Node.js에서 환경 변수는 `process.env.{환경변수명}` 형식 사용

서버 실행 결과 확인

![](https://user-images.githubusercontent.com/56855262/252338464-9eb6f44f-0fa3-491d-ab1e-393b248bc2b4.png)

- `npm run start`

![](https://user-images.githubusercontent.com/56855262/252338576-c70b8ea2-0392-4474-9874-55a0ff08b3e0.png)

- `npm run start:dev`

![](https://user-images.githubusercontent.com/56855262/252338664-977448ca-c49f-4ae8-8995-d1b41aba03f7.png)

- `npm run start:prod`

### local, dev, prod 환경 변수 추가하기

local, dev, prod용 환경 변수를 추가하고 서버 실행 환경에 따라 각 환경에 맞는 환경 변수 파일을 사용한다.

- `ConfigModule.forRoot` 메서드의 `envFilePath` 옵션을 사용한다.

각 서버 실행 환경에 사용할 환경 변수 파일을 추가한다.

- 프로젝트 루트 디렉터리에 `envs` 폴더를 추가하고 그 안에 환경 변수 파일을 추가한다.

```
# .local.env
SERVICE_URL=http://localhost:3000
```

```
# .dev.env
SERVICE_URL=http://dev.config-test.com
```

```
# .prod.env
SERVICE_URL=http://config-test.com
```

### 환경 변수에 따라 다른 환경 변수 파일을 사용하도록 설정하기

앱 모듈의 `ConfigModule.forRoot` 메서드에 `envFilePath` 옵션을 추가한다.

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { WeatherModule } from './weather/weather.module';

console.log(`실행 환경: ${process.env.NODE_ENV}`);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/envs/.${process.env.NODE_ENV}.env`, // 환경 변수 파일 경로 지정
    }),
    WeatherModule, //
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- `process.cwd()`: 현재 디렉터리 절대 경로를 리턴하므로, `npm run` 명령어가 실행되는 프로젝트 루트 디렉터리의 절대 경로를 리턴한다.
- `${프로젝트 루트 디렉터리의 절대 경로}/envs/.${process.env.NODE_ENV}.env`

### 테스트 라우트 핸들러 함수 추가하기

```ts
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private configService: ConfigService, // ConfigService 의존성 주입
  ) {}

  ...

  @Get('service-url')
  getServiceUrl(): string {
    return this.configService.get('SERVICE_URL');
  }
}
```

결과 확인

![](https://user-images.githubusercontent.com/56855262/252341666-fe4c17c3-a8d2-4633-8e62-107cbd866a39.png)

- `npm run start`
- NODE_ENV=local

![](https://user-images.githubusercontent.com/56855262/252341879-7074b77a-60ad-430e-ae8d-38832bf5c3dc.png)

- `npm run start:dev`
- NODE_ENV=dev

![](https://user-images.githubusercontent.com/56855262/252342049-7327a920-261a-47c6-b477-68e9cc1df16b.png)

- `npm run start:prod`
- NODE_ENV=prod

## 커스텀 환경 설정 파일 사용하기

`.ts` 파일을 환경 설정 파일로 사용할 수 있다.

- 복잡한 환경 변수 설정이 필요할 때 .ts 환경 설정 파일을 사용한다.
- .ts 파일을 사용하면 커스텀 환경 설정이 가능하다.
  - 환경 변수 파일에 공통으로 넣을 환경 변수 설정하기
  - YAML 파일을 환경 변수로 사용하기
  - 설정에 대한 유효성 검증하기
  - ...

`.ts` 파일을 사용해 진행할 커스텀 환경 설정

- 공통 환경 변수 설정
- YAML 파일을 환경 변수로 사용하기

`config.ts` 환경 변수 파일을 생성하는데, 이 파일이 핵심이다. 이 파일에 개발자가 환경 변수를 구성하는 로직을 작성할 수 있다.

`config.ts` 파일로 구성할 로직

1. `process.env.NODE_ENV` 값 확인
2. `{NODE_ENV}.ts` 파일 불러오기
3. `common.ts` 파일 불러오기
4. 2와 3을 병합하여 리턴

### 환경 변수 파일 생성하고 환경 변수 추가하기

`src` 디렉터리에 `configs` 디렉터리를 추가하고 환경 변수 파일들을 추가한다.

공통으로 사용할 환경 변수를 정의하는 `common.ts` 파일을 추가한다.

```ts
// /src/configs/common.ts

export default {
  logLevel: 'info',
  apiVersion: '1.0.0',
  MESSAGE: 'hello',
};
```

- 공통 환경 변수를 위한 객체를 내보낸다.

로컬 개발 환경의 환경 변수를 반환하는 `local.ts` 파일을 추가한다.

```ts
// /src/configs/local.ts

// 로컬 개발 환경의 환경 변수 내보내기
export default {
  dbInfo: 'http://localhost:3306', // DB 접속 정보
};
```

개발 환경의 환경 변수를 반환하는 `dev.ts` 파일을 추가한다.

```ts
// /src/configs/dev.ts

// 개발 환경의 환경 변수 내보내기
export default {
  logLevel: 'debug', // 로그 레벨
  dbInfo: 'http://dev-mysql:3306',
};
```

- 개발 환경에서는 `logLevel` 환경 변수의 값을 'debug'로 덮어쓴다.

프로덕션 환경의 환경 변수를 반환하는 `prod.ts` 파일을 추가한다.

```ts
// /src/configs/prod.ts

// 프로덕션 환경의 환경 변수 내보내기
export default {
  logLevel: 'error', // 로그 레벨
  dbInfo: 'http://prod-mysql:3306',
};
```

- 프로덕션 환경에서는 `logLevel` 환경 변수의 값을 'error'로 덮어쓴다.

마지막으로 `common.ts`와 각 환경 변수를 합치는 `config.ts` 파일을 추가한다.

```ts
// /src/configs/config.ts

import common from './common';
import local from './local';
import dev from './dev';
import prod from './prod';

const phase = process.env.NODE_ENV;

// phase 값에 따라 적절한 환경 변수 값 저장
let conf = {};

if (phase === 'local') {
  conf = local;
} else if (phase === 'dev') {
  conf = dev;
} else if (phase === 'prod') {
  conf = prod;
}

// common과 conf의 환경 변수 값을 합쳐서 결과값으로 주는 함수 리턴
export default () => ({
  ...common,
  ...conf,
});
```

- 서버 실행 환경에 따라 `conf`에 저장하는 값이 달라진다.
- 스프레드 연산자로 `common`과 `conf` 값을 합친다.
- ConfigModule.forRoot 메서드의 `load` 옵션을 사용해 커스텀 환경 파일을 로드하는데, 이 옵션은 `() => ({})`의 형태를 받기 때문에 이 형태로 리턴한다.

### ConfigModule.forRoot에 load 옵션 추가하기

커스텀 환경 파일을 로드하기 위해 `load` 옵션을 추가해야 한다.

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { WeatherModule } from './weather/weather.module';
import config from './weather/configs/config';

console.log(`실행 환경: ${process.env.NODE_ENV}`);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/envs/.${process.env.NODE_ENV}.env`,
      load: [config], // 커스텀 환경 설정 파일 설정
    }),
    WeatherModule, //
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 테스트 라우트 핸들러 함수 추가하기

```ts
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private configService: ConfigService, // ConfigService 의존성 주입
  ) {}

  ...

  @Get('db-info')
  getDbInfo(): string {
    console.log(this.configService.get('logLevel'));
    console.log(this.configService.get('apiVersion'));
    return this.configService.get('dbInfo');
  }
}
```

결과 확인

로컬 환경(`npm run start`)

![](https://user-images.githubusercontent.com/56855262/252349353-7675b433-f9d2-4015-9926-4b09c59bc086.png)

![](https://user-images.githubusercontent.com/56855262/252349303-666cafb2-56d7-4e45-85f0-c59637801956.png)

개발 환경(`npm run start:dev`)

![](https://user-images.githubusercontent.com/56855262/252349768-6a210803-0438-4868-9e5d-777e80157bb8.png)

![](https://user-images.githubusercontent.com/56855262/252349813-87aa2972-9f0a-478b-99b5-0c38047e9c05.png)

프로덕션 환경(`npm run start:prod`)

![](https://user-images.githubusercontent.com/56855262/252350031-03e60f44-03a3-45ea-8162-4ea803f01417.png)

![](https://user-images.githubusercontent.com/56855262/252350078-cbf19607-a15d-4781-9d63-e644c94d829b.png)

## 서버 실행 순서와 환경 설정 파일 초기화 순서 알아보기

현재 프로젝트를 기준으로 서버 실행 시 초기화 순서와 환경 변수 반영 순서에 대해 알아보자.

- `main.ts` 파일의 `bootstrap` 함수로 서버를 실행한다.
- `bootstrap` 함수 내부의 `NestFactory.create`가 실행되어 모듈을 초기화하는 작업을 진행한다.
- 각 모듈이 초기화될 때 의존성 주입하는 부분들을 초기화하고 주입하도록 인스턴스를 생성하는 작업을 진행한다.
  - 현재 프로젝트 기준으로 `ConfigModule`을 먼저 초기화하여 환경 변수를 어떤 모듈에서든지 읽을 수 있는 준비를 한다.
  - 다음으로 `AppModule`을 초기화한다.
  - 마지막으로 `WeatherModule`을 초기화한다.
  - 모듈별 초기화 순서는 프로젝트에 따라 다를 수 있다.
- `AppModule`의 `ConfigModule.forRoot`를 실행해 환경 변수 설정 파일을 읽는다.
  - 아무 설정이 없다면 `.env` 파일의 환경 변수를 읽는다.
  - `envFilePath`가 있다면 리스트에 담긴 파일 순서대로 환경 변수를 읽는다.
  - 시스템 환경 변수인 `process.env`에 있는 환경 변수를 읽어 합친다.
  - `load` 옵션이 있다면 옵션 값에 있는 환경 변수를 읽어 지금까지 만든 환경 변수와 합친다.
- 모듈이 모두 초기화되면 컨트롤러의 인스턴스를 생성하고 컨트롤러에 있는 핸들러 함수를 URL과 매핑한다.
  - 이 작업이 끝나면 서버가 실행된다는 메시지를 출력한다.

## YAML 파일을 사용해 환경 변수 설정하기

최근에는 환경 변수를 설정할 때 `YAML` 파일을 사용하는 경우가 많다.

- JSON에서 표현하는 모든 데이터 표현이 가능하다.
- 주석을 지원한다.

`ConfigModule`이 YAML 파일을 읽으려면 커스텀 환경 설정 파일에 YAML 파일을 읽을 수 있도록 코드를 작성해야 한다.

- `config.ts` 파일 수정

### 필요한 패키지 설치

먼저 필요한 패키지를 설치한다.

```bash
npm i js-yaml
npm i -D @types/js-yaml
```

### config.yaml 파일 생성하기

/src/envs 디렉터리 아래에 `config.ts` 파일에서 읽어올 `config.yaml` 파일을 추가한다.

/src/envs/config.yaml

```yaml
http:
  port: 3000

redis:
  host: 'localhost'
  port: 6379
```

### config.ts 파일 수정하기

YAML 파일은 커스텀 설정 파일로 취급하므로 `config.ts`에 설정을 추가한다.

```ts
import common from './common';
import local from './local';
import dev from './dev';
import prod from './prod';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';

...

// YAML 파일 로딩
const yamlConfig: Record<string, any> = yaml.load(
  readFileSync(`${process.cwd()}/src/envs/config.yaml`, 'utf-8'),
);

// common과 conf의 환경 변수 값을 합쳐서 결과값으로 주는 함수 리턴
export default () => ({
  ...common,
  ...conf,
  ...yamlConfig, // 기존 설정 마지막에 합치기
});
```

- `yaml.load` 메서드를 사용해 `config.yaml` 파일을 읽어온다.
  - 리턴 타입: Record<string, any>
- 기존 설정에 읽어온 설정을 덧붙인다.

### 테스트 핸들러 함수 추가하기

```ts
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private configService: ConfigService, // ConfigService 의존성 주입
  ) {}

  ...

  @Get('redis-info')
  getRedisInfo(): string {
    return `${this.configService.get('redis.host')}:${this.configService.get('redis.port')}`;
  }
}
```

결과 확인

![](https://user-images.githubusercontent.com/56855262/252358285-7370d87b-2960-4d0c-bf92-2ac2c3a447a5.png)

## 캐시 옵션 사용하기

설정 파일은 서버가 한 번 실행된 뒤에는 변경되지 않으므로 캐시를 사용하면 성능에서 이득이다.

- `ConfigModule.forRoot` 메서드의 `cache` 옵션을 사용한다.

```ts
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
      cache: true, // 캐싱
    }),
    WeatherModule, //
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- `cache: true`를 설정하면 ConfigService의 get 메서드가 파일이 아닌 캐시에서 먼저 불러오므로 성능상의 이점이 있다.
- 환경 설정이 많아져 파일이 커지는 경우 메모리에서 읽는 것이 성능상으로 이득이다.

## 확장 변수 사용하기

확장 변수는 이미 선언된 변수를 다른 변수에 `${변수명}`으로 할당하는 기능이다.

/프로젝트 루트 디렉터리/envs/.local.env

```
SERVER_DOMAIN=localhost
SERVER_PORT=3000

SERVER_URL=http://${SERVER_DOMAIN}:${SERVER_PORT}
```

확장 변수를 사용하려면 `ConfigModule`에 `expandVariables` 옵션을 설정해야 한다.

```ts
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
```

### 테스트 라우트 핸들러 추가하기

```ts
@Get('server-url')
getServerUrl(): string {
  return this.configService.get('SERVER_URL');
}
```

결과 확인(`npm run start`)

![](https://user-images.githubusercontent.com/56855262/252360624-99a29499-38e1-4683-9490-32e265127485.png)

## main.ts에서 환경 변수 사용하기

`main.ts` 파일은 서버 실행 시 가장 먼저 실행되는 파일이다. 가장 먼저 실행되므로 `NestFactory.create`를 호출하기 전까지는 `ConfigModule`이 초기화되지 않아 활성화되지 않는다.

또한 `main.ts` 파일의 `bootstrap`은 클래스가 아니라 함수이므로 의존성 주입을 받을 수 없어 다른 방법으로 `ConfigService`를 사용해야 한다.

- `app.get` 메서드에 `ConfigService` 클래스를 인수로 주어 반환값을 받는 방식을 사용한다.

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configServie = app.get(ConfigService);
  await app.listen(configServie.get('SERVER_PORT'));
}
bootstrap();
```

- `app.get` 메서드에 `ConfigService`를 넣으면 앱의 환경 변수를 사용할 수 있는 인스턴스를 반환한다.
- `configService` 인스턴스를 사용해 서버 포트 정보를 환경 변수로 사용한다.
