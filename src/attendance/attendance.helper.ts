import { differenceInMinutes, parse } from 'date-fns';
import { formatToGMT7 } from 'src/common/date.helper';

export const MAX_CHECK_IN_TIME = '08:15';
export const MIN_CHECK_OUT_TIME = '17:00';

export const calculateLateDuration = (checkInTimeUTC: Date): string => {
  // Use today’s date in GMT+7 (for both 2 compared)
  const todayStr = formatToGMT7(new Date(), 'yyyy-MM-dd');
  const actualTime = formatToGMT7(checkInTimeUTC, 'HH:mm:ss');
  const maxTime = MAX_CHECK_IN_TIME + ':00';

  const maxCheckInDate = parse(
    `${todayStr} ${maxTime}`,
    'yyyy-MM-dd HH:mm',
    new Date(),
  );

  const actualCheckInDate = parse(
    `${todayStr} ${actualTime}`,
    'yyyy-MM-dd HH:mm',
    new Date(),
  );

  // If on time or early
  if (actualCheckInDate <= maxCheckInDate) return '0h 0m';

  // Calculate late duration
  const diffMinutes = differenceInMinutes(actualCheckInDate, maxCheckInDate);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours}h ${minutes}m`;
};

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

    if (checkInLocal <= MAX_CHECK_IN_TIME) {
      status = 'Present';
    } else if (checkInLocal > MAX_CHECK_IN_TIME) {
      status = 'Late';
    } else {
      status = 'Absent';
    }
  } else {
    status = 'Absent';
  }

  return status;
};

export const STD_WORKING_HOURS = getWorkingHoursInGMT7(
  parse(MAX_CHECK_IN_TIME, 'HH:mm', new Date()),
  parse(MIN_CHECK_OUT_TIME, 'HH:mm', new Date()),
);
