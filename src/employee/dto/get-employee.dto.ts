import { Role } from 'src/user/dto/get-user.dto';

export class EmployeeDtoResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  hiredDate: string;
  updatedAt: string;
}
