export class GetDashboardDtoResponse {
  maxCheckIn?: string;
  minCheckOut?: string;
  stdWorkingHours?: string;
  role: string;
  employeesCount?: string | number;
  attendancesCount?: string | number;
}
