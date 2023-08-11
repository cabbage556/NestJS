import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from "src/user/user.model";

// req 객체에서 user를 가져오는 커스텀 데코레이터 생성
export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
