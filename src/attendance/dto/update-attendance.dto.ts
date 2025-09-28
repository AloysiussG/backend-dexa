import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceDtoResponse } from './create-attendance.dto';

export class UpdateAttendanceDtoResponse extends PartialType(
  CreateAttendanceDtoResponse,
) {}
