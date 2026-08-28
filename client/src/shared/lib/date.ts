import { DateTime, Info } from 'luxon';

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);
const stripDot = (value: string): string => value.replace(/\.$/, '');

/** Горизонт бронирования по ТЗ */
export const MAX_ADVANCE_DAYS = 30;

const ISO_DATE = 'yyyy-MM-dd';

export function todayISODate(zone?: string): string {
  const now = zone ? DateTime.now().setZone(zone) : DateTime.now();
  return now.toFormat(ISO_DATE);
}

export function addDaysISO(iso: string, days: number): string {
  return DateTime.fromISO(iso).plus({ days }).toFormat(ISO_DATE);
}

/** b - a в днях, без учёта времени */
export function diffInDays(aIso: string, bIso: string): number {
  const a = DateTime.fromISO(aIso).startOf('day');
  const b = DateTime.fromISO(bIso).startOf('day');
  return Math.round(b.diff(a, 'days').days);
}

export function clampISODate(iso: string, minIso: string, maxIso: string): string {
  if (iso < minIso) return minIso;
  if (iso > maxIso) return maxIso;
  return iso;
}

export function isSameISODate(a: string, b: string): boolean {
  return a === b;
}

export interface MonthGridDay {
  iso: string;
  day: number;
  inCurrentMonth: boolean;
}

/**
 * Сетка месяца: 6 недель по 7 дней, неделя начинается с понедельника.
 * `monthAnchor` может быть любой датой внутри нужного месяца.
 */
export function buildMonthGrid(monthAnchor: string): MonthGridDay[][] {
  const anchor = DateTime.fromISO(monthAnchor);
  const firstOfMonth = anchor.startOf('month');
  const gridStart = firstOfMonth.startOf('week');
  const currentMonth = anchor.month;

  const weeks: MonthGridDay[][] = [];
  let cursor = gridStart;
  for (let week = 0; week < 6; week += 1) {
    const days: MonthGridDay[] = [];
    for (let dow = 0; dow < 7; dow += 1) {
      days.push({
        iso: cursor.toFormat(ISO_DATE),
        day: cursor.day,
        inCurrentMonth: cursor.month === currentMonth,
      });
      cursor = cursor.plus({ days: 1 });
    }
    weeks.push(days);
  }
  return weeks;
}

/** «Октябрь 2026» */
export function formatMonthTitle(monthAnchor: string): string {
  const dt = DateTime.fromISO(monthAnchor).setLocale('ru');
  return `${capitalize(dt.toFormat('LLLL'))} ${dt.toFormat('yyyy')}`;
}

/** «24 октября, Чт» */
export function formatDateHuman(iso: string): string {
  const dt = DateTime.fromISO(iso).setLocale('ru');
  return `${dt.toFormat('d MMMM')}, ${capitalize(stripDot(dt.toFormat('ccc')))}`;
}

export function shortWeekdays(): string[] {
  return Info.weekdays('short', { locale: 'ru' }).map((label) => capitalize(stripDot(label)));
}
