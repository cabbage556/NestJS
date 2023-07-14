# NestJS 시작하기

## NestJS가 필요한 이유

Express는 특정 아키텍처를 요구하지 않기 때문에 서버를 개발할 때 아키텍처 설계에 대해 고민해야 하는 단점이 있다.

NestJS는 Express의 아키텍처 문제를 해결한다.

-   누구든 비슷하게 아키텍처를 설계하도록 하여 Express의 아키텍처 문제를 해결하는데 중점을 두었다.

서버 개발에서 좋은 아키텍처가 필요한 이유

-   쉽게 테스트 가능
-   쉽게 확장 가능
-   모듈 간 의존성을 줄여 유지보수가 편리해짐

## NestJS

NestJS는 컨트롤러, 프로바이더, 모듈을 사용하는 서버 애플리케이션 아키텍처를 제공해 프로젝트의 복잡성을 관리하는 것을 목표로 한다.

NestJS의 특징

-   Node.js에서 실행
-   타입스크립트 완벽 지원
-   최신 자바스크립트 스펙 사용
-   기본적으로 내부에서 Express를 사용 (Fastify 사용도 가능)

NestJS의 핵심 기능 중 하나는 **의존성 주입**이다.

-   의존성 주입은 모듈 간의 결합도를 낮춰 코드 재사용을 용이하게 해준다.
-   모듈 내에서의 코드 응집도를 높여 모듈의 재사용을 꾀하고 모듈 간에는 결합도를 낮춰 다양한 아키텍처에서 활용할 수 있게 해준다.
-   이를 위한 장치들로 모듈, 가드, 파이프, 미들웨어, 인터셉터 같은 모듈들이 존재한다.

NestJS는 상업용 서버에서 필요한 대부분의 기능을 제공한다.

-   RDB와 NoSQL 연동
-   세션 처리
-   문서화
-   테스트 지원
-   로깅
-   태스크 스케쥴링

NestJS는 데코레이터를 많이 사용한다.

-   데코레이터는 사용이 직관적이고 간편하기 때문에 NestJS에서는 데코레이터를 적극적으로 사용한다.

NestJS의 데코레이터와 익스프레스에 대응되는 값들(데코레이터 - 익스프레스)

-   @Request, @Req - req(Request 객체)
-   @Response, @Res - res(Response 객체)
-   @Next - next
-   @Session - req.session
-   @Param(key?) - req.params, req.params[key]
-   @Body(key?) - req.body, req.body[key]
-   @Query(key?) - req.query, req.query[key]
-   @Headers(name?) - req.headers, req.headers[name]
-   @Ip() - req.ip
-   @HostParam() - req.hosts

NestJS는 익스프레스를 내장하고 있어 익스프레스 기반의 미들웨어를 거의 대부분 사용할 수 있다.

-   HTTP 요청과 응답에 익스프레스의 Request와 Response 객체를 기본적으로 사용한다.
-   익스프레스가 아닌 패스티파이로 바꿔 사용할 수도 있다.

![](https://user-images.githubusercontent.com/56855262/253587789-c13aecd9-f547-446f-bd44-e131ce95e0ff.png)

## NestJS 설치하고 실행하기

NestJS 프로젝트를 실행하는 일반적인 방법은 `nest-cli` 패키지를 설치하고 `nest` 명령어를 사용하는 것이다.

NestJS 프로젝트에 필요한 설정 파일들이 무엇이 있는지 알아보기 위해 NestJS 프로젝트에 필요한 패키지들을 하나씩 설치하고 설정해본다.

### 의존성 패키지 설치

```bash
npm i @nestjs/core @nestjs/common @nestjs/platform-express reflect-metadata typescript
```

-   `@nestjs/common`: 실제 프로젝트에서 사용할 대부분의 코드가 들어 있다. 데코레이터로 사용하는 함수들의 클래스들이 대표적.
-   `@nestjs/core`: `@nestjs/common`에서 사용하는 코드가 들어 있다. 가드, 미들웨어, 파이프 등을 만드는 핵심 코드가 들어 있다.
-   `@nestjs/platform-express`: HTTP 요청과 응답을 감싸서 익스프레스의 req, res 객체를 사용하는 패키지.
-   `reflect-metadata`: 데코레이터를 사용하기 위해 필요한 패키지.

### 타입스크립트 설정하기

어떤 방식으로 타입스크립트를 자바스크립트로 컴파일할지 설정을 추가해야 한다.

-   타입스크립트 설정 파일: `tsconfig.json`
-   프로젝트 루트 디렉터리에 생성한다.

```json
{
    "compilerOptions": {
        "module": "CommonJS",
        "target": "ESNext",
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```

-   `compilerOptions`: 타입스크립트의 컴파일 옵션 설정
-   `module`: 컴파일 시 모듈 시스템 선택 가능, Node.js의 모듈 시스템인 CommonJS 사용 설정
-   `target`: 컴파일 시 사용할 ECMA 버전 명시. ESNext로 설정하면 최신 버전으로 컴파일
-   `experimentalDecorators`: 데코레이터 사용 여부, 데코레이터를 사용할 수 있게 true로 설정 (타입스크립트 5.0 버전부터 정식 지원)
-   `emitDecoratorMetadata`: 타입스크립트 컴파일 시 데코레이터가 설정된 클래스, 함수, 변수, 객체의 메타데이터를 함께 넣어줄지 여부를 선택한다.
    -   메타데이터: 데코레이터가 설정된 곳이 함수인지, 클래스인지, 변수인지에 대한 여부와 매개변수가 있다면 해당 타입, 그리고 결과값을 포함
    -   메타데이터를 넣을 때 `reflect-metadata` 패키지가 사용된다.
    -   `reflect-metadata`와 `emitDecoratorMetadata`는 함께 설정되어야 한다.

### NestJS의 모듈과 컨트롤러 만들기

NestJS는 웹 서버이므로 기본적으로 HTTP 요청과 응답을 처리한다.

NestJS에서 HTTP 요청을 처리하는 순서

-   파이프 -> 가드 -> 컨트롤러 -> 서비스 -> 레포지토리

클라이언트의 요청을 코드에 전달해야 하므로 컨트롤러는 필수이다. 그리고 컨트롤러는 모듈에 포함된다.

-   NestJS를 실행시키려면 하나의 모듈과 하나의 컨트롤러가 필요하다.

컨트롤러 코드 작성 (src/hello.controller.ts)

```ts
import { Controller, Get } from "@nestjs/common";

@Controller()
export class HelloController {
    @Get()
    hello() {
        return "안녕하세요!";
    }
}
```

-   @Controller와 @Get 모두 함수이면서 데코레이터이다.
-   데코레이터는 클래스, 함수, 변수 위에 또는 왼쪽에 붙여 코드의 동작을 변경한다.
-   데코레이터는 보통 클래스와 함수의 앞뒤에 전후 처리를 해줘서 해당 코드 동작에 부가적인 기능을 추가하기 위해 사용한다.
-   모듈에 컨트롤러를 포함시켜야 하므로 `export`를 붙인다.
-   @Get 데코레이터는 GET 방식 요청을 처리한다.

모듈 코드 작성 (src/hello.module.ts)

```ts
import { Module } from "@nestjs/common";
import { HelloController } from "./hello.controller";

@Module({
    controllers: [HelloController],
})
export class HelloModule {}
```

-   `@Module`은 모듈 설정 시 사용하는 데코레이터
-   `controllers`에는 배열로 모듈에 포함된 컨트롤러들을 설정

### 앱 실행하기

`main.ts` 코드 작성 (src/main.ts)

```ts
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
```

-   NestJS 서버를 기동하기 위해 최초로 실행되는 함수가 `bootstrap`이다. NestJS에서는 진입점을 `bootstrap`으로 짓는 것이 관례
-   `NestFactory`는 `create` 메서드에 루트 모듈을 넣어 `NestApplication` 객체를 생성한다.
-   NestApplication 객체는 기본적으로 익스프레스를 사용한다.
-   `listen` 메서드는 익스프레스의 `listen` 메서드이다.

서버 실행하기

    ```bash
    npx ts-node-dev src/main.ts
    ```

결과 확인

![](https://user-images.githubusercontent.com/56855262/253595212-6f2f147e-c2e5-4de9-8b68-91f046ee1514.png)

### NestJS의 네이밍 규칙

NestJS의 네이밍 컨벤션은 다음 규칙을 따른다.

1. 파일명은 `.`으로 연결한다. 모듈이 둘 이상의 단어로 구성되어 있으면 대시로 연결한다.

    ```
    // <모듈명>.<컴포넌트명>.ts
    hello.controller.ts
    hello.module.ts
    my-first.controller.ts
    ```

2. 클래스명은 카멜 케이스를 사용한다.

    ```
    // <모듈명><컴포넌트명>
    HelloController
    HelloModule
    ```

3. 같은 디렉터리에 있는 클래스는 index.ts를 통해 임포트하는 것을 권장한다.

    ```ts
    // index.ts를 사용하는 경우
    import { MyFirstController } from "./controllers/my-first.controller";
    import { MySecondController } from "./controllers/my-second.controller";

    // index.ts를 사용하는 경우
    import { MyFirstController, MySecondController } from "./controllers";
    ```

4. 인터페이스 작명법으로 파일명 앞에 `I`를 붙이는 방법이 있다. `Series`라는 타입을 정의한다면 `ISeries`처럼 작명하는 것이다. 이 방식은 조금 어색해서 NestJS에서는 가능하면 `Series` 인터페이스를 만들고 그 하위 인터페이스나 클래스를 만든다.

    ```ts
    interface Series { ... }
    interface BookSeries extends Series { ... }
    class MovieSeries extends Series { ... }
    ```
