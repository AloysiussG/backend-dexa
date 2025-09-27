import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [CommonModule, UserModule, AuthModule, EmployeeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
