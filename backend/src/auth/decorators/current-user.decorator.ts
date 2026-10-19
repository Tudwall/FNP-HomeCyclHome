import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export interface AuthUser {
  userId: number;
  email: string;
}

export const currentUserFactory = (
  _data: unknown,
  ctx: ExecutionContext,
): AuthUser => ctx.switchToHttp().getRequest<Request>().user as AuthUser;

export const CurrentUser = createParamDecorator(currentUserFactory);
