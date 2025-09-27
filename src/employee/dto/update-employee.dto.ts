import { Role } from 'src/user/dto/get-user.dto';
import { CreateEmployeeDtoResponse } from './create-employee.dto';

export class UpdateEmployeeDtoRequest {
  name: string;
  email: string;
  role: Role;
  hiredDate: Date;
}

export class UpdateEmployeeDtoResponse extends CreateEmployeeDtoResponse {}
