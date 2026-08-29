import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';
import { createBookingSchema, toStartIso, type BookingFormValues } from './schema';

const NOW = DateTime.fromISO('2026-10-20T12:00:00+03:00');
const schema = createBookingSchema({ timezone: 'Europe/Moscow', now: NOW });

const base: BookingFormValues = {
  title: 'Синк',
  date: '2026-10-21',
  start: '10:00',
  duration: 60,
  comment: '',
  repeat: 'none',
  repeatUntil: '2026-10-21',
};

const messages = (values: BookingFormValues): Record<string, string> => {
  const result = schema.safeParse(values);
  if (result.success) return {};
  return Object.fromEntries(
    result.error.issues.map((issue) => [issue.path.join('.'), issue.message]),
  );
};

describe('createBookingSchema', () => {
  it('пропускает корректную бронь', () => {
    expect(schema.safeParse(base).success).toBe(true);
  });

  it('требует тему встречи', () => {
    expect(messages({ ...base, title: '  ' })).toMatchObject({ title: 'field.required' });
  });

  it('запрещает прошлое', () => {
    expect(messages({ ...base, date: '2026-10-19' })).toMatchObject({
      date: 'createBooking.errors.past',
    });
  });

  it('запрещает время не кратное 15 минутам', () => {
    expect(messages({ ...base, start: '10:07' })).toMatchObject({
      start: 'createBooking.errors.notAligned',
    });
  });

  it('запрещает выход за рабочие часы', () => {
    expect(messages({ ...base, start: '19:30', duration: 60 })).toMatchObject({
      duration: 'createBooking.errors.outsideHours',
    });
  });

  it('запрещает бронь дальше 30 дней', () => {
    expect(messages({ ...base, date: '2026-12-01' })).toMatchObject({
      date: 'createBooking.errors.tooFar',
    });
  });
});

describe('toStartIso', () => {
  it('собирает ISO в зоне офиса', () => {
    expect(toStartIso({ date: '2026-10-21', start: '10:00' }, 'Europe/Moscow')).toBe(
      '2026-10-21T10:00:00+03:00',
    );
  });
});
