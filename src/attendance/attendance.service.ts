import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import {
  AttendanceDetailDtoResponse,
  AttendanceListDtoResponse,
} from './dto/get-attendance.dto';
import { differenceInMinutes } from 'date-fns';
import { formatToGMT7, toUTC } from 'src/common/date.helper';

@Injectable()
export class AttendanceService {
  constructor(private readonly prismaService: PrismaService) {}

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

      // Status logic using GMT+7
      let status: 'Present' | 'Late' | 'Absent';

      if (attendance?.checkInTime && attendance?.checkOutTime) {
        const checkInLocal = formatToGMT7(attendance.checkInTime, 'HH:mm');

        if (checkInLocal <= '08:15') {
          status = 'Present';
        } else if (checkInLocal > '08:15') {
          status = 'Late';
        } else {
          status = 'Absent';
        }
      } else {
        status = 'Absent';
      }

      //   if (attendance) {
      //     const checkIn = attendance.checkInTime;
      //     const checkOut = attendance.checkOutTime;

      //     if (
      //       checkIn &&
      //       checkIn <=
      //         new Date(
      //           attendanceDate.getTime() + 8 * 60 * 60 * 1000 + 15 * 60 * 1000,
      //         ) &&
      //       checkOut &&
      //       checkOut >= new Date(attendanceDate.getTime() + 17 * 60 * 60 * 1000)
      //     ) {
      //       status = 'Present';
      //     } else if (
      //       checkIn &&
      //       checkIn >
      //         new Date(
      //           attendanceDate.getTime() + 8 * 60 * 60 * 1000 + 15 * 60 * 1000,
      //         )
      //     ) {
      //       status = 'Late';
      //     } else {
      //       status = 'Absent';
      //     }
      //   } else {
      //     status = 'Absent';
      //   }

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

  /**
   * Get single attendance details
   */
  async getAttendanceById(id: number): Promise<AttendanceDetailDtoResponse> {
    const attendance = await this.prismaService.attendance.findUnique({
      where: { id },
      include: { User: true },
    });

    if (!attendance) throw new HttpException('Attendance not found', 404);

    // Calculate working hours in GMT+7
    let workingHours: string | undefined = undefined;
    if (attendance.checkInTime && attendance.checkOutTime) {
      const checkInLocal = new Date(
        formatToGMT7(attendance.checkInTime, 'yyyy-MM-dd HH:mm:ss'),
      );
      const checkOutLocal = new Date(
        formatToGMT7(attendance.checkOutTime, 'yyyy-MM-dd HH:mm:ss'),
      );

      const diffMinutes = differenceInMinutes(checkOutLocal, checkInLocal);

      //   const diffMinutes = differenceInMinutes(
      //     attendance.checkOutTime,
      //     attendance.checkInTime,
      //   );

      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      workingHours = `${hours}h ${minutes}m`;
    }

    // Status logic using GMT+7
    let status: 'Present' | 'Late' | 'Absent';

    if (attendance?.checkInTime && attendance?.checkOutTime) {
      const checkInLocal = formatToGMT7(attendance.checkInTime, 'HH:mm');

      if (checkInLocal <= '08:15') {
        status = 'Present';
      } else if (checkInLocal > '08:15') {
        status = 'Late';
      } else {
        status = 'Absent';
      }
    } else {
      status = 'Absent';
    }

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
