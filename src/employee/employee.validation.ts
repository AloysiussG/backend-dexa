import z, { ZodType } from 'zod';

export class EmployeeValidation {
  static readonly CREATE_EMPLOYEE: ZodType = z.object({
    name: z.string().trim().min(1, {
      message: 'Employee name is required.',
    }),
    email: z.string().trim().min(1, { message: 'Email is required.' }),
    password: z
      .string()
      .trim()
      .min(1, { message: 'Password is required.' })
      .optional(),
    role: z.string().trim().min(1, { message: 'Role is required.' }),
    hiredDate: z.string().trim().min(1, { message: 'Hired date is required.' }),
  });

  static readonly UPDATE_EMPLOYEE: ZodType = z.object({
    name: z.string().trim().min(1, {
      message: 'Employee name is required.',
    }),
    password: z
      .string()
      .trim()
      .min(1, { message: 'Password is required.' })
      .optional()
      .nullable(),
    email: z.string().trim().min(1, { message: 'Email is required.' }),
    role: z.string().trim().min(1, { message: 'Role is required.' }),
    hiredDate: z.string().trim().min(1, { message: 'Hired date is required.' }),
  });
}
