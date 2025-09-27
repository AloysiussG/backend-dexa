type Role = 'HR' | 'Employee';

export class AddEmployeeRequest {
  name: string;
  email: string;
  password: string;
  role: Role;
  hiredDate: Date;
}

export class AddEmployeeResponse {
  id: string;
  name: string;
  email?: string;
}

export class UserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  hiredDate: Date;
}
