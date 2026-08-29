import { DateTime } from 'luxon';
import { MAX_ADVANCE_DAYS } from '@/shared/lib/date';

export type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'weekdays';

export interface ExpandRecurrenceInput {
  startDate: string;
  frequency: RecurrenceFrequency;
  /** Включительно */
  until?: string;
  maxCount?: number;
  /** «Сегодня» в таймзоне офиса, от него считается 30-дневный горизонт */
  today?: string;
}

const HARD_CAP = 60;

/** Учитывает горизонт бронирования (+30 дней), `until` и `maxCount` */
export function expandRecurrence({
  startDate,
  frequency,
  until,
  maxCount = HARD_CAP,
  today,
}: ExpandRecurrenceInput): string[] {
  if (frequency === 'none') return [startDate];

  const start = DateTime.fromISO(startDate);
  if (!start.isValid) return [];

  const horizon = DateTime.fromISO(today ?? startDate).plus({ days: MAX_ADVANCE_DAYS });
  const untilDt = until ? DateTime.fromISO(until) : null;
  const limit = untilDt && untilDt < horizon ? untilDt : horizon;

  const step = frequency === 'weekly' ? { weeks: 1 } : { days: 1 };
  const dates: string[] = [];
  let cursor = start;

  while (cursor <= limit && dates.length < Math.min(maxCount, HARD_CAP)) {
    const isWeekend = cursor.weekday === 6 || cursor.weekday === 7;
    if (frequency !== 'weekdays' || !isWeekend) {
      dates.push(cursor.toFormat('yyyy-MM-dd'));
    }
    cursor = cursor.plus(step);
  }

  return dates;
}
