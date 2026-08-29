import { describe, expect, it } from 'vitest';
import { expandRecurrence } from './recurrence';

describe('expandRecurrence', () => {
  it('none даёт только стартовую дату', () => {
    expect(expandRecurrence({ startDate: '2026-10-21', frequency: 'none' })).toEqual([
      '2026-10-21',
    ]);
  });

  it('daily: подряд идущие дни до until', () => {
    expect(
      expandRecurrence({
        startDate: '2026-10-21',
        frequency: 'daily',
        until: '2026-10-24',
        today: '2026-10-20',
      }),
    ).toEqual(['2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24']);
  });

  it('weekly: шаг в 7 дней', () => {
    expect(
      expandRecurrence({
        startDate: '2026-10-21',
        frequency: 'weekly',
        until: '2026-11-12',
        today: '2026-10-20',
      }),
    ).toEqual(['2026-10-21', '2026-10-28', '2026-11-04', '2026-11-11']);
  });

  it('weekdays: пропускает субботу и воскресенье', () => {
    // 2026-10-23 пятница, 24 и 25 выходные, 26 понедельник
    expect(
      expandRecurrence({
        startDate: '2026-10-23',
        frequency: 'weekdays',
        until: '2026-10-27',
        today: '2026-10-20',
      }),
    ).toEqual(['2026-10-23', '2026-10-26', '2026-10-27']);
  });

  it('уважает 30-дневный горизонт от today', () => {
    const dates = expandRecurrence({
      startDate: '2026-10-21',
      frequency: 'daily',
      until: '2026-12-31',
      today: '2026-10-21',
    });
    expect(dates[0]).toBe('2026-10-21');
    expect(dates.at(-1)).toBe('2026-11-20'); // +30 дней
  });

  it('уважает maxCount', () => {
    expect(
      expandRecurrence({
        startDate: '2026-10-21',
        frequency: 'daily',
        until: '2026-11-20',
        today: '2026-10-20',
        maxCount: 3,
      }),
    ).toHaveLength(3);
  });
});
