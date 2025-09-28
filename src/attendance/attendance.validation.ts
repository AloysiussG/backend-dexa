import z, { ZodType } from 'zod';

export class AttendanceValidation {
  static readonly CREATE_ATTENDANCE: ZodType = z.object({
    photoUrl: z.string().trim().min(1, {
      message: 'Attendance photo URL is required.',
    }),
  });
}
