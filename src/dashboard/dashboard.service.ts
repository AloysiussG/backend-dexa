import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetDashboardDtoResponse } from './dto/get-dashboard.dto';
import { Logger } from 'winston';
import { PrismaService } from 'src/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TIMEZONE, toUTC } from 'src/common/date.helper';
import { formatInTimeZone } from 'date-fns-tz';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async getMainDashboard(user: User): Promise<GetDashboardDtoResponse> {
    if (user?.role == 'HR') {
      // get employees count
      const employeesCount = await this.prismaService.user.count();

      // get today (Jakarta perspective)
      const nowJakarta = new Date(); // local server time, but we treat it as "today" Jakarta
      // truncate to midnight Jakarta, then convert to UTC for DB
      const todayUtc = toUTC(
        formatInTimeZone(nowJakarta, TIMEZONE, 'yyyy-MM-dd'), // "2025-09-28"
      );
      // get attendances count (today)
      const attendancesCount = await this.prismaService.attendance.count({
        where: {
          date: todayUtc,
        },
      });

      return {
        role: 'HR',
        employeesCount,
        attendancesCount,
      };
    }
    return {
      role: 'Employee',
    };
  }
}
