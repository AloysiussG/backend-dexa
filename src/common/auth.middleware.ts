import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { NextFunction, Request, Response } from 'express';

interface RequestWithUser extends Request {
  cookies: Record<string, string | undefined>;
  user?: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  /**
   * Middleware
   * Get token from httpOnly cookie / headers authorization
   */
  constructor(private prismaService: PrismaService) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    // get token from authenticated request
    // Try cookie first, fallback to Authorization header
    const cookieToken = req.cookies?.token;

    let headerToken = req.headers['authorization'];

    // Strip Bearer if present
    if (headerToken && headerToken.startsWith('Bearer ')) {
      headerToken = headerToken.slice(7);
    }

    const token = cookieToken || headerToken;

    if (token) {
      const user = await this.prismaService.user.findFirst({
        where: {
          token: token,
        },
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  }
}
