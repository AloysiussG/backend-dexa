// src/common/date.helper.ts
import { fromZonedTime, formatInTimeZone } from 'date-fns-tz';

const TIMEZONE = 'Asia/Jakarta';

// whenever any client input from Asia/Jakarta GMT+7 (current), convert to UTC date
export function toUTC(dateString: string): Date {
  return fromZonedTime(dateString, TIMEZONE);
}

// the db is still at UTC date, to convert to Asia/Jakarta GMT+7, this function have to be called,
// also convert that to string
export function formatToGMT7(date: Date, pattern = 'yyyy-MM-dd'): string {
  return formatInTimeZone(date, TIMEZONE, pattern);
}
