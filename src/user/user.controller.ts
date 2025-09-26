import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from 'src/model/web.model';
import { AddEmployeeRequest, AddEmployeeResponse } from 'src/model/user.model';

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
}
