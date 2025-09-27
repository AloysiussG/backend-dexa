import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { Request } from 'express';

// Extend Express Request to include user
interface AuthenticatedRequest extends Request {
  user?: User;
}

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    if (user) {
      return user;
    } else {
      throw new HttpException('Unauthorized', 401);
    }
  },
);
