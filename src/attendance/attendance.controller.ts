import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Body,
} from '@nestjs/common';
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
import {
  CreateAttendanceDtoRequest,
  CreateAttendanceDtoResponse,
} from './dto/create-attendance.dto';
import { UpdateAttendanceDtoResponse } from './dto/update-attendance.dto';

@UseGuards(RolesGuard)
@Controller('/api/attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Get current attendance for current user
  @Get('/current')
  @Roles('Employee', 'HR')
  async getCurrentAttendanceOfUser(
    @Auth() user: User,
  ): Promise<WebResponse<CurrentAttendanceDetailDtoResponse>> {
    const data = await this.attendanceService.getCurrentAttendanceOfUser(user);
    return {
      data,
      message: `Your attendance details retrieved successfully for today.`,
    };
  }

  // Handle check in for current user
  @Post('/check-in')
  @Roles('Employee', 'HR')
  async checkIn(
    @Auth() user: User,
    @Body() createAttendanceDto: CreateAttendanceDtoRequest,
  ): Promise<WebResponse<CreateAttendanceDtoResponse>> {
    const data = await this.attendanceService.checkIn(
      user,
      createAttendanceDto,
    );
    return {
      data,
      message: `You have successfully check-in for today.`,
    };
  }

  // Handle check out for current user
  @Patch('/check-out/:id')
  @Roles('Employee', 'HR')
  async checkOut(
    @Auth() user: User,
    @Param('id') id: string,
  ): Promise<WebResponse<UpdateAttendanceDtoResponse>> {
    const data = await this.attendanceService.checkOut(+id, user);
    return {
      data,
      message: `You have successfully check-out for today.`,
    };
  }

  // list attendances for a date
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

  // get single attendance detail
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
