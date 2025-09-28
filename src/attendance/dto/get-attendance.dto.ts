export class AttendanceListDtoResponse {
  id: number | null; // null if user has not checked in yet
  name: string;
  email?: string;
  role: string;
  date: string; // attendance date
  checkInTime?: string | null;
  checkOutTime?: string | null;
  status: 'Present' | 'Late' | 'Absent';
  workingHours?: string; // calculated from checkInTime and checkOutTime
}

export class AttendanceDetailDtoResponse {
  id: number;
  name: string;
  email?: string;
  role: string;
  date: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  status: 'Present' | 'Late' | 'Absent';
  workingHours?: string; // calculated from checkInTime and checkOutTime
  photoUrl?: string | null;
}

export class CurrentAttendanceDetailDtoResponse {
  id?: number | null;
  name: string;
  email?: string;
  role: string;
  date: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  status?: 'Present' | 'Late' | 'Absent';
  workingHours?: string; // calculated from checkInTime and checkOutTime
  photoUrl?: string | null;
}
