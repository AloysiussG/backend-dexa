import { Controller, Get, HttpCode } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Auth } from 'src/common/auth.decorator';
import { WebResponse } from 'src/model/web.dto';
import type { User } from '@prisma/client';
import { GetDashboardDtoResponse } from './dto/get-dashboard.dto';

@Controller('/api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/current')
  @HttpCode(200)
  async getUser(
    @Auth() user: User,
  ): Promise<WebResponse<GetDashboardDtoResponse>> {
    const result = await this.dashboardService.getMainDashboard(user);
    return {
      data: result,
    };
  }
}
