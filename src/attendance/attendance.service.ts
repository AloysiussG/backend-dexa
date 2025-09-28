import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import {
  AttendanceDetailDtoResponse,
  AttendanceListDtoResponse,
  CurrentAttendanceDetailDtoResponse,
} from './dto/get-attendance.dto';
import { formatToGMT7, TIMEZONE, toUTC } from 'src/common/date.helper';
import { User } from '@prisma/client';
import {
  getAttendanceStatusInGMT7,
  getWorkingHoursInGMT7,
} from './attendance.helper';
import { formatInTimeZone } from 'date-fns-tz';
import {
  CreateAttendanceDtoRequest,
  CreateAttendanceDtoResponse,
} from './dto/create-attendance.dto';
import { ValidationService } from 'src/common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AttendanceValidation } from './attendance.validation';
import { UpdateAttendanceDtoResponse } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly prismaService: PrismaService,
  ) {}

  // Check-out
  async checkOut(id: number, user: User): Promise<UpdateAttendanceDtoResponse> {
    // get today (Jakarta perspective)
    const nowJakarta = new Date(); // local server time, but we treat it as "today" Jakarta

    // truncate to midnight Jakarta, then convert to UTC for DB
    const todayUtc = toUTC(
      formatInTimeZone(nowJakarta, TIMEZONE, 'yyyy-MM-dd'), // "2025-09-28" -> prioritize date only
    );

    // get the actual timestamp
    // convert the actual check-in timestamp to UTC
    const checkOutUtc = toUTC(
      formatInTimeZone(nowJakarta, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss"),
    );

    // search for attendance
    const attendance = await this.prismaService.attendance.findFirst({
      where: {
        id,
        userId: user.id,
        date: todayUtc,
        checkOutTime: null,
        checkInTime: { not: null }, // ensure they did check-in
      },
      include: { User: true },
    });

    // this already filters if the attendance is theirs
    // the attendance date is today (since we can only check out today)
    // and is the check out time still null (active attendance)
    // and check in time isnt null
    if (!attendance) throw new HttpException('Attendance not found', 404);

    // if found update the check out time
    const newAttendance = await this.prismaService.attendance.update({
      where: { id },
      data: {
        checkOutTime: checkOutUtc,
      },
    });

    return {
      id: newAttendance.id,
    };
  }

  // Check-in
  async checkIn(
    user: User,
    data: CreateAttendanceDtoRequest,
  ): Promise<CreateAttendanceDtoResponse> {
    this.logger.info(`Create Attendance ${JSON.stringify(data)}`);

    // validation
    const attendanceRequest =
      this.validationService.validate<CreateAttendanceDtoRequest>(
        AttendanceValidation.CREATE_ATTENDANCE,
        data,
      );

    // get today (Jakarta perspective)
    const nowJakarta = new Date(); // local server time, but we treat it as "today" Jakarta

    // truncate to midnight Jakarta, then convert to UTC for DB
    const todayUtc = toUTC(
      formatInTimeZone(nowJakarta, TIMEZONE, 'yyyy-MM-dd'), // "2025-09-28" -> prioritize date only
    );

    // get the actual timestamp
    // convert the actual check-in timestamp to UTC
    const checkInUtc = toUTC(
      formatInTimeZone(nowJakarta, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss"),
    );

    // make sure there is no attendance for today
    const attendance = await this.prismaService.attendance.findFirst({
      where: { userId: user.id, date: todayUtc },
      include: { User: true },
    });

    // if there is any attendance, throw error
    if (attendance) {
      throw new HttpException('You have already checked-in for today', 400);
    }

    // create attendance
    const newAttendance = await this.prismaService.attendance.create({
      data: {
        date: todayUtc,
        checkInTime: checkInUtc,
        userId: user.id,
        status: getAttendanceStatusInGMT7(checkInUtc),
        photoUrl: attendanceRequest.photoUrl,
      },
    });

    return {
      id: newAttendance.id,
    };
  }

  /**
   * Get all users attendances for a date
   */
  async getAttendances(date?: string): Promise<AttendanceListDtoResponse[]> {
    // Convert input date (GMT+7) to UTC start of day
    const attendanceDateUTC = date
      ? toUTC(date)
      : toUTC(new Date().toISOString());
    attendanceDateUTC.setHours(0, 0, 0, 0);

    // const startOfDayUTC = attendanceDateUTC;
    // const endOfDayUTC = new Date(
    //   attendanceDateUTC.getTime() + 24 * 60 * 60 * 1000 - 1,
    // );

    // Get all users hired on or before the attendance date
    const users = await this.prismaService.user.findMany({
      where: {
        hiredDate: { lte: attendanceDateUTC },
      },
      orderBy: { name: 'asc' },
    });

    // Get all attendances for that date
    const attendances = await this.prismaService.attendance.findMany({
      where: {
        date: attendanceDateUTC,
        // date: { gte: startOfDayUTC, lte: endOfDayUTC },
      },
    });

    return users.map((user) => {
      const attendance = attendances.find((a) => a.userId === user.id);

      // status logic using GMT+7
      const status = getAttendanceStatusInGMT7(
        attendance?.checkInTime,
        attendance?.checkOutTime,
      );

      return {
        id: attendance?.id ?? null,
        name: user.name,
        role: user.role,
        date: formatToGMT7(attendance?.date || attendanceDateUTC, 'yyyy-MM-dd'),
        checkInTime: attendance?.checkInTime
          ? formatToGMT7(attendance.checkInTime, 'HH:mm')
          : null,
        checkOutTime: attendance?.checkOutTime
          ? formatToGMT7(attendance.checkOutTime, 'HH:mm')
          : null,
        status,
      };
    });
  }

  async getCurrentAttendanceOfUser(
    user: User,
  ): Promise<CurrentAttendanceDetailDtoResponse> {
    // get today (Jakarta perspective)
    const nowJakarta = new Date(); // local server time, but we treat it as "today" Jakarta

    // truncate to midnight Jakarta, then convert to UTC for DB
    const todayUtc = toUTC(
      formatInTimeZone(nowJakarta, TIMEZONE, 'yyyy-MM-dd'), // "2025-09-28"
    );

    const attendance = await this.prismaService.attendance.findFirst({
      where: { userId: user.id, date: todayUtc },
      include: { User: true },
    });

    // the user hasnt checked in for today, return empty details
    if (!attendance) {
      return {
        name: user?.name ?? 'Unknown',
        role: user?.role ?? 'Employee',
        date: formatToGMT7(todayUtc, 'yyyy-MM-dd'),
        checkInTime: null,
        checkOutTime: null,
      };
    }

    // if found return the details
    // calculate working hours in GMT+7
    const workingHours = getWorkingHoursInGMT7(
      attendance.checkInTime,
      attendance.checkOutTime,
    );

    // status logic using GMT+7
    const status = getAttendanceStatusInGMT7(
      attendance.checkInTime,
      attendance.checkOutTime,
    );

    return {
      id: attendance.id,
      name: attendance.User?.name ?? 'Unknown',
      role: attendance.User?.role ?? 'Employee',
      date: formatToGMT7(attendance.date, 'yyyy-MM-dd'),
      checkInTime: attendance.checkInTime
        ? formatToGMT7(attendance.checkInTime, 'HH:mm:ss')
        : null,
      checkOutTime: attendance.checkOutTime
        ? formatToGMT7(attendance.checkOutTime, 'HH:mm:ss')
        : null,
      status: status,
      workingHours,
      photoUrl: attendance.photoUrl ?? null,
    };
  }

  /**
   * Get single attendance details
   */
  async getAttendanceById(id: number): Promise<AttendanceDetailDtoResponse> {
    const attendance = await this.prismaService.attendance.findUnique({
      where: { id },
      include: { User: true },
    });

    if (!attendance) throw new HttpException('Attendance not found', 404);

    // calculate working hours in GMT+7
    const workingHours = getWorkingHoursInGMT7(
      attendance.checkInTime,
      attendance.checkOutTime,
    );

    // status logic using GMT+7
    const status = getAttendanceStatusInGMT7(
      attendance.checkInTime,
      attendance.checkOutTime,
    );

    return {
      id: attendance.id,
      name: attendance.User?.name ?? 'Unknown',
      role: attendance.User?.role ?? 'Employee',
      date: formatToGMT7(attendance.date, 'yyyy-MM-dd'),
      checkInTime: attendance.checkInTime
        ? formatToGMT7(attendance.checkInTime, 'HH:mm:ss')
        : null,
      checkOutTime: attendance.checkOutTime
        ? formatToGMT7(attendance.checkOutTime, 'HH:mm:ss')
        : null,
      status: status,
      workingHours,
      photoUrl: attendance.photoUrl ?? null,
    };
  }
}
