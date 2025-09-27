export class LoginRequest {
  email: string;
  password: string;
}

export class LoginResponse {
  id: string;
  name: string;
  email?: string;
  token: string;
}
