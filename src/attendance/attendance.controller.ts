import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import {
  AttendanceDetailDtoResponse,
  AttendanceListDtoResponse,
} from './dto/get-attendance.dto';
import { WebResponse } from 'src/model/web.dto';

@UseGuards(RolesGuard)
@Controller('/api/attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

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
