import { Body, Controller, Delete, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse } from 'src/auth/dto/auth.dto';
import { WebResponse } from 'src/model/web.dto';
import type { Response } from 'express';
import { Auth } from 'src/common/auth.decorator';
import type { User } from '@prisma/client';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<WebResponse<LoginResponse>> {
    const result = await this.authService.login(request);

    // Set HttpOnly cookie with the token
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // https true in prod
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      path: '/',
    });

    return {
      data: result,
      message: 'Login success.',
    };
  }

  @Delete('/logout')
  @HttpCode(200)
  async logout(
    @Auth() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<WebResponse<boolean>> {
    await this.authService.logout(user);

    // clear cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // https true in prod
      sameSite: 'lax',
      path: '/',
    });

    return {
      data: true,
      message: 'Logged out successfully',
    };
  }
}
