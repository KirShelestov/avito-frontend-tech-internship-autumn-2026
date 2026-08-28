import { describe, expect, it } from 'vitest';
import {
  addDaysISO,
  buildMonthGrid,
  clampISODate,
  diffInDays,
  formatDateHuman,
  formatMonthTitle,
  shortWeekdays,
} from './date';

describe('addDaysISO', () => {
  it('прибавляет дни с переходом через месяц', () => {
    expect(addDaysISO('2026-10-30', 3)).toBe('2026-11-02');
    expect(addDaysISO('2026-10-01', -1)).toBe('2026-09-30');
  });
});

describe('diffInDays', () => {
  it('считает разницу в днях', () => {
    expect(diffInDays('2026-10-01', '2026-10-31')).toBe(30);
    expect(diffInDays('2026-10-31', '2026-10-01')).toBe(-30);
  });
});

describe('clampISODate', () => {
  it('зажимает в диапазон', () => {
    expect(clampISODate('2026-09-01', '2026-10-01', '2026-10-31')).toBe('2026-10-01');
    expect(clampISODate('2026-12-01', '2026-10-01', '2026-10-31')).toBe('2026-10-31');
    expect(clampISODate('2026-10-15', '2026-10-01', '2026-10-31')).toBe('2026-10-15');
  });
});

describe('buildMonthGrid', () => {
  it('строит 6 недель по 7 дней, начиная с понедельника', () => {
    const grid = buildMonthGrid('2026-10-15');
    expect(grid).toHaveLength(6);
    expect(grid[0]).toHaveLength(7);
    // 1 октября 2026 выпадает на четверг, поэтому сетка начинается с 28 сентября (пн)
    expect(grid[0]![0]).toMatchObject({ iso: '2026-09-28', inCurrentMonth: false });
    expect(grid[0]![3]).toMatchObject({ iso: '2026-10-01', day: 1, inCurrentMonth: true });
  });
});

describe('formatMonthTitle', () => {
  it('капитализирует месяц и добавляет год', () => {
    expect(formatMonthTitle('2026-10-15')).toBe('Октябрь 2026');
  });
});

describe('formatDateHuman', () => {
  it('форматирует дату по-русски', () => {
    expect(formatDateHuman('2026-10-22')).toBe('22 октября, Чт');
  });
});

describe('shortWeekdays', () => {
  it('возвращает Пн…Вс', () => {
    expect(shortWeekdays()).toEqual(['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']);
  });
});
