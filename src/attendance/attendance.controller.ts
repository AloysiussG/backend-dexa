import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import {
  AttendanceDetailDtoResponse,
  AttendanceListDtoResponse,
  CurrentAttendanceDetailDtoResponse,
} from './dto/get-attendance.dto';
import { WebResponse } from 'src/model/web.dto';
import { Auth } from 'src/common/auth.decorator';
import type { User } from '@prisma/client';

@UseGuards(RolesGuard)
@Controller('/api/attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Get current attendance for current user
  @Get('/current')
  async getCurrentAttendanceOfUser(
    @Auth() user: User,
  ): Promise<WebResponse<CurrentAttendanceDetailDtoResponse>> {
    const data = await this.attendanceService.getCurrentAttendanceOfUser(user);
    return {
      data,
      message: `Your attendance details retrieved successfully for today.`,
    };
  }

  // (1) List attendances for a date
  @Get()
  @Roles('HR')
  async getAttendances(
    @Query('date') date?: string,
  ): Promise<WebResponse<AttendanceListDtoResponse[]>> {
    const data = await this.attendanceService.getAttendances(date);
    return {
      data,
      message: `Attendances retrieved successfully for ${date ?? 'today'}.`,
    };
  }

  // (2) Get single attendance detail
  @Get(':id')
  @Roles('HR')
  async getAttendance(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<AttendanceDetailDtoResponse>> {
    const data = await this.attendanceService.getAttendanceById(id);
    return {
      data,
      message: `Attendance details retrieved successfully.`,
    };
  }
}
