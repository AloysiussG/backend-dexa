import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from 'src/model/web.model';
import {
  AddEmployeeRequest,
  AddEmployeeResponse,
  UserResponse,
} from 'src/model/user.model';
import { Auth } from 'src/common/auth.decorator';
import type { User } from '@prisma/client';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(200)
  async addEmployee(
    @Body() request: AddEmployeeRequest,
  ): Promise<WebResponse<AddEmployeeResponse>> {
    const result = await this.userService.addEmployee(request);
    return {
      data: result,
    };
  }

  @Get('/current')
  @HttpCode(200)
  getUser(@Auth() user: User): WebResponse<UserResponse> {
    const result = this.userService.getUser(user);
    return {
      data: result,
    };
  }
}
