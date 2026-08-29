import { DateTime } from 'luxon';
import { z } from 'zod';
import { isAlignedToStep } from '@/shared/lib/time';

export interface BookingFormValues {
  title: string;
  date: string;
  start: string;
  duration: number;
  comment: string;
}

export interface SchemaContext {
  timezone: string;
  /** Точка отсчёта для проверки «в прошлом», по умолчанию текущий момент */
  now?: DateTime;
}

const WORKDAY_START_MIN = 9 * 60;
const WORKDAY_END_MIN = 20 * 60;
const MAX_ADVANCE_MS = 30 * 24 * 60 * 60 * 1000;

export function toStartIso(
  values: Pick<BookingFormValues, 'date' | 'start'>,
  timezone: string,
): string {
  const [hour, minute] = values.start.split(':').map(Number);
  return (
    DateTime.fromISO(values.date, { zone: timezone })
      .set({ hour: hour ?? 0, minute: minute ?? 0, second: 0, millisecond: 0 })
      .toISO({ suppressMilliseconds: true }) ?? ''
  );
}

/** Тексты ошибок в схеме являются ключами i18n */
export function createBookingSchema({ timezone, now }: SchemaContext) {
  const currentNow = now ?? DateTime.now();

  return z
    .object({
      title: z.string().trim().min(1, 'field.required').max(200),
      date: z.string().min(1),
      start: z.string().regex(/^\d{2}:\d{2}$/),
      duration: z.number().int().positive(),
      comment: z.string().trim().max(2000),
    })
    .superRefine((values, ctx) => {
      const startDt = DateTime.fromISO(toStartIso(values, timezone), { setZone: true });
      if (!startDt.isValid) {
        ctx.addIssue({
          code: 'custom',
          path: ['start'],
          message: 'createBooking.errors.notAligned',
        });
        return;
      }

      if (!isAlignedToStep(values.start, 15)) {
        ctx.addIssue({
          code: 'custom',
          path: ['start'],
          message: 'createBooking.errors.notAligned',
        });
      }

      if (startDt.toMillis() <= currentNow.toMillis()) {
        ctx.addIssue({ code: 'custom', path: ['date'], message: 'createBooking.errors.past' });
      }

      if (startDt.toMillis() - currentNow.toMillis() > MAX_ADVANCE_MS) {
        ctx.addIssue({ code: 'custom', path: ['date'], message: 'createBooking.errors.tooFar' });
      }

      const endDt = startDt.plus({ minutes: values.duration });
      const startMin = startDt.hour * 60 + startDt.minute;
      const endMin = endDt.hour * 60 + endDt.minute;
      const sameDay = startDt.toISODate() === endDt.toISODate();
      if (!sameDay || startMin < WORKDAY_START_MIN || endMin > WORKDAY_END_MIN) {
        ctx.addIssue({
          code: 'custom',
          path: ['duration'],
          message: 'createBooking.errors.outsideHours',
        });
      }
    });
}
