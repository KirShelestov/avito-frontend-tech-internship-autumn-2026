import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';
import { addMinutesIso, nextSlotTime, roundUpToStep, zonedIso } from './datetime';

describe('roundUpToStep', () => {
  it('округляет вверх', () => {
    expect(roundUpToStep(0, 15)).toBe(0);
    expect(roundUpToStep(1, 15)).toBe(15);
    expect(roundUpToStep(46, 15)).toBe(60);
  });
});

describe('zonedIso', () => {
  it('собирает ISO с офсетом московской зоны', () => {
    expect(zonedIso('2026-08-19', '13:00', 'Europe/Moscow')).toBe('2026-08-19T13:00:00+03:00');
  });

  it('учитывает переданное время', () => {
    expect(zonedIso('2026-01-15', '09:30', 'Europe/Moscow')).toBe('2026-01-15T09:30:00+03:00');
  });
});

describe('addMinutesIso', () => {
  it('прибавляет минуты, сохраняя офсет', () => {
    expect(addMinutesIso('2026-08-19T13:00:00+03:00', 90)).toBe('2026-08-19T14:30:00+03:00');
  });
});

describe('nextSlotTime', () => {
  it('округляет текущее время вверх до шага', () => {
    const ref = DateTime.fromISO('2026-08-19T10:07:00+03:00');
    expect(nextSlotTime('Europe/Moscow', 15, ref)).toBe('10:15');
  });

  it('не выходит за пределы суток', () => {
    const ref = DateTime.fromISO('2026-08-19T23:58:00+03:00');
    expect(nextSlotTime('Europe/Moscow', 15, ref)).toBe('23:45');
  });
});
