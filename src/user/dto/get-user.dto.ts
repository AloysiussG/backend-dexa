export type Role = 'HR' | 'Employee';

export class UserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  hiredDate: Date;
}
