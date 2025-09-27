import { Injectable } from '@nestjs/common';
import { UserResponse } from 'src/user/dto/get-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  // get current user by token
  // tanpa async, logic ada pada middleware untuk get user by token
  getUser(user: User): UserResponse {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      hiredDate: user.hiredDate,
    };
  }
}
