import z, { ZodType } from 'zod';

export class AuthValidation {
  static readonly LOGIN: ZodType = z.object({
    email: z
      .email({ error: 'Invalid email address' })
      .trim()
      .min(1, { message: 'Email is required' }),
    password: z.string().trim().min(1, { message: 'Password is required' }),
  });
}
