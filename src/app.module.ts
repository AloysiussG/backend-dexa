import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [CommonModule, UserModule, AuthModule, EmployeeModule, AttendanceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
