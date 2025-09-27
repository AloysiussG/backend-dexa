import { Controller, Get, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from 'src/model/web.dto';
import { UserResponse } from 'src/user/dto/get-user.dto';
import { Auth } from 'src/common/auth.decorator';
import type { User } from '@prisma/client';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/current')
  @HttpCode(200)
  getUser(@Auth() user: User): WebResponse<UserResponse> {
    const result = this.userService.getUser(user);
    return {
      data: result,
    };
  }
}
