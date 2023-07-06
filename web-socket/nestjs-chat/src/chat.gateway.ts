import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// 네임스페이스 추가
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer() server: Server; // 웹소켓 서버 인스턴스 선언

  // 'message' 이벤트 구독 리스너
  @SubscribeMessage('message')
  handleMessage(
    socket: Socket, //
    data: any, // 클라이언트에서 'message'라는 이벤트로 데이터가 전송되면 data 파라미터로 데이터가 들어온다.
  ): void {
    const { message, nickname } = data;

    // 닉네임을 포함한 메시지 전송
    socket.broadcast.emit('message', `${nickname}: ${message}`);
  }
}

// 'room' 네임스페이스 추가
@WebSocketGateway({ namespace: 'room' })
export class RoomGateway {
  constructor(
    private readonly chatGateway: ChatGateway, // ChatGateway 의존성 주입
  ) {}

  @WebSocketServer() server: Server; // 서버 인스턴스
  rooms = []; // 채팅방 리스트

  // 'createRoom' 이벤트 핸들러 메서드
  @SubscribeMessage('createRoom')
  handleMessage(
    @MessageBody() data, // 소켓 없이 데이터만 받기
  ) {
    const { nickname, room } = data;

    // 방 생성 시 이벤트를 발생시켜 클라이언트에 전송
    this.chatGateway.server.emit('notice', {
      message: `${nickname}님이 ${room}방을 만들었습니다.`,
    });

    this.rooms.push(room); // 채팅방 추가
    this.server.emit('rooms', this.rooms); // rooms 이벤트로 채팅방 리스트 전송
  }

  // 'joinRoom' 이벤트 핸들러 메서드
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    socket: Socket, //
    data: any,
  ) {
    const { nickname, room, toLeaveRoom } = data;

    // 기존 방에서 먼저 나가기
    socket.leave(toLeaveRoom);

    // 공지 이벤트 발생
    this.chatGateway.server.emit('notice', {
      message: `${nickname}님이 ${room}방에 입장했습니다.`,
    });

    // 새로운 방 입장하기
    socket.join(room);
  }

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
}
