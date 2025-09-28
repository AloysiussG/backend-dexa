import { differenceInMinutes } from 'date-fns';
import { formatToGMT7 } from 'src/common/date.helper';

export const getWorkingHoursInGMT7 = (
  checkInTimeUTC?: Date | null,
  checkOutTimeUTC?: Date | null,
) => {
  // calculate working hours in GMT+7
  let workingHours: string | undefined = undefined;

  if (checkInTimeUTC && checkOutTimeUTC) {
    const checkInLocal = new Date(
      formatToGMT7(checkInTimeUTC, 'yyyy-MM-dd HH:mm:ss'),
    );
    const checkOutLocal = new Date(
      formatToGMT7(checkOutTimeUTC, 'yyyy-MM-dd HH:mm:ss'),
    );

    const diffMinutes = differenceInMinutes(checkOutLocal, checkInLocal);

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    workingHours = `${hours}h ${minutes}m`;
  }

  return workingHours;
};

export const getAttendanceStatusInGMT7 = (checkInTimeUTC?: Date | null) => {
  // status logic using GMT+7
  let status: 'Present' | 'Late' | 'Absent';

  if (checkInTimeUTC) {
    const checkInLocal = formatToGMT7(checkInTimeUTC, 'HH:mm');

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

  return status;
};
