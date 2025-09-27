import { Role } from 'src/user/dto/get-user.dto';

export class CreateEmployeeDtoRequest {
  name: string;
  email: string;
  password: string;
  role: Role;
  hiredDate: Date;
}

export class CreateEmployeeDtoResponse {
  id: string;
  name: string;
  email?: string;
}
