# NestJS 채팅 애플리케이션(socket.io 사용)

## socket.io

- 웹소켓을 기반으로 서버-클라이언트 양방향 통신을 지원하는 라이브러리
- 기본적으로 웹소켓 지원
- 재접속, 브로드캐스팅, 멀티플렉싱(채팅방) 기능도 제공

NestJS의 경우 웹소켓, socket.io 기반 실시간 애플리케이션 제작을 모두 지원한다.

- socket.io 사용 시 클라이언트에 추가 작업 필요

## 필요한 패키지 설치

- socket.io 사용

```bash
npm i @nestjs/websockets @nestjs/platform-socket.io
npm i -D @types/socket.io
```

## html 파일을 불러오도록 main.ts 설정

익스프레스를 사용해서 정적 파일을 서비스할 수 있는 설정 추가

- 간단한 설정: 익스프레스 사용
- 정밀한 설정: server-static 사용

main.ts 파일 수정

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // NestExpressApplication 인스턴스 생성
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'static')); // 정적 파일 경로 지정
  await app.listen(3000);
}
bootstrap();
```

프로젝트 루트 디렉터리에 `static` 디렉터리 생성 후 `index.html` 파일 추가

## 서버 작업을 위한 게이트웨이 만들기

NestJS에서 게이트웨이

- 웹소켓을 사용한 통신을 받아주는 클래스
- 컨트롤러와 같은 개념
- 의존성 주입, 데코레이터, 필터, 가드 등의 NestJS 기능 사용 가능
- 웹소켓 프로토콜을 사용하는 요청은 게이트웨이에서 처리
- `@WebSocketGateway()` 데코레이터를 붙인 클래스가 게이트웨이 역할을 한다.

게이트웨이 파일 생성

- /nestjs-chat/src/chat.gateway.ts

```ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// 웹소켓 서버 설정 데코레이터: 게이트웨이를 설정하는 데코레이터
// 내부적으로 socket.io 서버를 생성하는 것과 같다.
@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server; // 웹소켓 서버 인스턴스 선언

  // 'message' 이벤트 구독 리스너
  @SubscribeMessage('message')
  handleMessage(
    socket: Socket, // 하나의 웹소켓 연결에 대한 인스턴스
    data: any, // 클라이언트에서 'message'라는 이벤트로 데이터가 전송되면 data 파라미터로 데이터가 들어온다.
  ): void {
    // 접속한 모든 클라이언트에게 메시지 전송
    // emit(이벤트명, 전송할 메시지)
    this.server.emit('message', `client-${socket.id.substring(0, 4)}: ${data}`);
  }
}
```

## 게이트웨이 모듈에 등록

작성한 게이트웨이 사용을 위해 모듈에 등록한다.

- app.module.ts에 등록한다.

```ts
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
```

게이트웨이는 다른 클래스에 주입 가능한 프로바이더이므로 프로바이더로 등록한다.

## 채팅방 기능 구현하기

socket.io는 채팅방을 만드는 `room` 기능을 제공한다.

- 채팅방별로 메시지를 통신해야 하므로 `네임스페이스`를 사용한다.
- `네임스페이스`: 네임스페이스로 지정된 곳에만 이벤트를 발생시키고 메시지를 전송하는 개념, `멀티플렉싱`이라고도 한다.

### 네임스페이스 사용하기

서버와 클라이언트는 실제로는 하나의 연결(HTTP 또는 웹소켓)만 사용한다. 네임스페이스를 사용하면 하나의 연결을 로직으로 나누어 사용할 수 있다.

- 채팅방 입장 전이라면 `chat` 네임스페이스의 `message` 이벤트 사용
- 채팅방 입장했다면 `room` 네임스페이스의 `message` 이벤트 사용

`gateway` 파일을 수정한다.

```ts
// 네임스페이스 추가
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway {
  ...
}
```

- `@WebSocketGateway` 데코레이터에 옵션값으로 네임스페이스 `chat` 지정

### 닉네임 추가하기

서버 게이트웨이 코드 수정

- 서버에 전송한 메시지는 다른 사람 화면에만 표시되도록 브로드캐스팅한다.
- 메시지를 "{닉네임}: ${메시지}" 형태로 전달한다.
- 클라이언트에서 닉네임 정보를 받아와야 한다.

```ts
@SubscribeMessage('message')
handleMessage(
  socket: Socket, //
  data: any, // 클라이언트에서 'message'라는 이벤트로 데이터가 전송되면 data 파라미터로 데이터가 들어온다.
): void {
  const { message, nickname } = data;

  // 닉네임을 포함한 메시지 전송
  socket.broadcast.emit('message', `${nickname}: ${message}`);
}
```

- 기존 `server.emit`: 나를 포함한 모든 클라이언트에게 메시지 전송
- `socket.broadcast.emit`: 전송 요청한 클라이언트를 제외하고 다른 클라이언트들에게만 데이터 전송
  - 메시지 상대를 구분하기 쉽게 해준다.

### 채팅방 생성하기

socket.io의 `room` 기능을 사용해 채팅방을 생성한다.

채팅방 게이트웨이 클래스를 추가한다.

`chat.gateway.ts`

```ts
// 'room' 네임스페이스 추가
@WebSocketGateway({ namespace: 'room' })
export class RoomGateway {
  @WebSocketServer() server: Server; // 서버 인스턴스
  rooms = []; // 채팅방 리스트

  // 'createRoom' 이벤트 핸들러 메서드
  @SubscribeMessage('createRoom')
  handleMessage(
    @MessageBody() data, // 소켓 없이 데이터만 받기
  ) {
    const { nickname, room } = data;
    this.rooms.push(room); // 채팅방 추가
    this.server.emit('rooms', this.rooms); // rooms 이벤트로 채팅방 리스트 전송
  }
}
```

- `room` 네임스페이스를 사용하는 `RoomGateway` 클래스 추가
- `handleMessage`: 클라이언트에서 요청한 `createRoom` 이벤트 처리하는 핸들러 메서드
- `@MessageBody` 데코레이터: 소켓을 사용하지 않고 data만 있는 경우 필요
- `rooms` 이벤트를 사용해 갱신된 채팅방 정보를 접속한 클라이언트들에게 전송

채팅방 게이트웨이 클래스를 프로바이더로 app.module에 등록한다.

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway, RoomGateway } from './chat.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ChatGateway, RoomGateway],
})
export class AppModule {}
```

### 공지 영역과 채팅방 입장 구현하기

클라이언트에서 보낸 값을 처리할 서버 측 게이트웨이 클래스를 수정한다.

- `RoomGateway` 클래스를 수정한다.

```ts
@WebSocketGateway({ namespace: 'room' })
export class RoomGateway {
  constructor(
    private readonly chatGateway: ChatGateway, // 1️⃣ ChatGateway 의존성 주입
  ) {}

  @WebSocketServer() server: Server;
  rooms = [];

  // 'createRoom' 이벤트 핸들러 메서드
  @SubscribeMessage('createRoom')
  handleMessage(
    @MessageBody() data, //
  ) {
    const { nickname, room } = data;

    // 2️⃣ 방 생성 시 이벤트를 발생시켜 클라이언트에 전송
    this.chatGateway.server.emit('notice', {
      message: `${nickname}님이 ${room}방을 만들었습니다.`,
    });

    this.rooms.push(room); // 채팅방 추가
    this.server.emit('rooms', this.rooms); // rooms 이벤트로 채팅방 리스트 전송
  }

  // 3️⃣ 'joinRoom' 이벤트 핸들러 메서드
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    socket: Socket, //
    data: any,
  ) {
    const { nickname, room, toLeaveRoom } = data;

    // 4️⃣ 기존 방에서 먼저 나가기
    socket.leave(toLeaveRoom);

    // 5️⃣ 공지 이벤트 발생
    this.chatGateway.server.emit('notice', {
      message: `${nickname}님이 ${room}방에 입장했습니다.`,
    });

    // 6️⃣ 새로운 방 입장하기
    socket.join(room);
  }
}
```

1️⃣ `ChatGateway` 의존성 주입: 게이트웨이도 프로바이더이므로 의존성 주입해 사용할 수 있다.

- 게이트웨이 클래스 간에도 동일하게 적용 가능
- `ChatGateway`의 인스턴스를 공지 처리를 위해 사용한다.

2️⃣ 방 생성 시 클라이언트 공지 영역에 데이터를 나타내는 기능 추가

3️⃣ `handleJoinRoom` 메서드는 `joinRoom` 이벤트를 처리하는 이벤트 핸들러 메서드

4️⃣ 기존 방에서 나가야 다른 방에 입장 가능하므로 먼저 방에서 나가는 함수 실행: `socket.leave(채팅방)`

5️⃣ 방 입장 시 클라이언트 공지 영역에 데이터를 나타내는 기능 추가

6️⃣ 방에 입장하는 함수 실행: `socket.join(채팅방)`

### 채팅방에서 대화 나누기 구현하기

`RoomGateway`에 `message` 이벤트 핸들러 메서드를 추가한다.

```ts
// 'message' 이벤트 핸들러 메서드
@SubscribeMessage('message')
handleMessageToRoom(
  socket: Socket, //
  data: any,
) {
  const { nickname, room, message } = data;

  // 자신을 제외한 나머지 사람들에게 데이터 전송
  socket.broadcast.to(room).emit('message', {
    message: `${nickname}: ${message}`,
  });
}
```

- `handleMessageToRoom`: 클라이언트에서 `RoomGateway`로 `message` 이벤트를 보내면 처리하는 핸들러 메서드
- `socket.broadcast.to(방이름).emit(이벤트명, 메시지)`: 지정한 채팅방으로 메시지를 자신을 제외한 모든 사람들에게 전송

### 결과

![](https://user-images.githubusercontent.com/56855262/251401653-93c519f2-1094-41c8-8731-1594dd1d0fb8.png)
