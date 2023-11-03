import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST }) // REQUEST 스코프 설정: 요청마다 userId가 달라질 수 있으므로 요청마다 새로운 RequestService 인스턴스 생성
export class RequestService {
  private userId: string;

  setUserID(userId: string) {
    this.userId = userId;
  }

  getUserId() {
    return this.userId;
  }
}
