import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IGetUser } from './interfaces/get-user.decorator.interface';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): IGetUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
