import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  // data: 데코레이터 호출 시 직접 전달하는 아규먼트(user 객체에서 뽑고 싶은 필드)
  // ctx: 데코레이터 호출 시 암시적으로 ExecutionContext를 전달 받음
  (data: string | undefined, ctx: ExecutionContext) => {
    // ExecutionContext를 Http로 변환 후 req 객체를 가져온다.
    const request = ctx.switchToHttp().getRequest();

    if (data) return request.user[data];

    // req 객체에 포함된 user 객체를 리턴(Guard의 validate 메서드에서 리턴한 payload가 req 객체의 user에 포함됨)
    return request.user;
  },
);
