import { describe, expect, it } from 'vitest';
import {
  dayBoundsIso,
  dayCellParts,
  formatDateInZone,
  formatTimeInZone,
  minutesOfDayInZone,
  zoneAbbr,
} from './datetime';

describe('datetime: работа с таймзоной офиса', () => {
  it('formatTimeInZone показывает локальное время комнаты', () => {
    expect(formatTimeInZone('2026-10-24T12:00:00Z', 'Europe/Moscow')).toBe('15:00');
  });

  it('minutesOfDayInZone возвращает минуты от полуночи в зоне', () => {
    expect(minutesOfDayInZone('2026-10-24T12:00:00Z', 'Europe/Moscow')).toBe(15 * 60);
  });

  it('dayBoundsIso: сутки в зоне офиса как ISO с офсетом', () => {
    expect(dayBoundsIso('2026-10-24', 'Europe/Moscow')).toEqual({
      from: '2026-10-24T00:00:00+03:00',
      to: '2026-10-25T00:00:00+03:00',
    });
  });

  it('dayCellParts: месяц прописью и число', () => {
    expect(dayCellParts('2026-10-24T09:00:00+03:00', 'Europe/Moscow')).toEqual({
      month: 'ОКТЯБРЬ',
      day: '24',
    });
  });

  it('formatDateInZone: «Суббота, 24 октября»', () => {
    expect(formatDateInZone('2026-10-24T09:00:00+03:00', 'Europe/Moscow')).toBe(
      'Суббота, 24 октября',
    );
  });

  it('zoneAbbr: короткая аббревиатура', () => {
    expect(zoneAbbr('Europe/Moscow', undefined)).toMatch(/MSK|GMT\+3/);
  });
});
