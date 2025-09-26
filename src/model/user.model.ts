export class AddEmployeeRequest {
  name: string;
  email: string;
  password: string;
  role: 'HR' | 'Employee';
  hiredDate: Date;
}

export class AddEmployeeResponse {
  id: string;
  name: string;
  email?: string;
}
