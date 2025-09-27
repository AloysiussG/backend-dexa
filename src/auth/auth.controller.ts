import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse } from 'src/auth/dto/auth.dto';
import { WebResponse } from 'src/model/web.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: LoginRequest,
  ): Promise<WebResponse<LoginResponse>> {
    const result = await this.authService.login(request);
    return {
      data: result,
    };
  }
}
