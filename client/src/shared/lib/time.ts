/** Утилиты для работы со временем суток в формате «HH:MM» (без даты и таймзоны). */

export const MINUTES_IN_DAY = 24 * 60;

export function timeToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function minutesToTime(total: number): string {
  const normalized = ((total % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function isAlignedToStep(value: string, step: number): boolean {
  const minutes = timeToMinutes(value);
  return minutes !== null && minutes % step === 0;
}

const clampHours = (value: string): string => (Number(value) > 23 ? '23' : value);
const clampMinutes = (value: string): string => (Number(value) > 59 ? '59' : value);

/**
 * Приводит сырой ввод к маске «HH:MM»: оставляет только цифры,
 * прогрессивно подставляет двоеточие, ограничивает часы 23, минуты 59.
 */
export function maskTimeInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length === 0) return '';
  if (digits.length === 1) return digits;

  if (digits.length === 2) {
    return Number(digits) <= 23 ? digits : `0${digits[0]}:${digits[1]}`;
  }

  if (digits.length === 3) {
    const twoDigitHours = digits.slice(0, 2);
    return Number(twoDigitHours) <= 23
      ? `${twoDigitHours}:${digits[2]}`
      : `0${digits[0]}:${clampMinutes(digits.slice(1, 3))}`;
  }

  return `${clampHours(digits.slice(0, 2))}:${clampMinutes(digits.slice(2, 4))}`;
}

/** Ближайшее валидное значение: кратное шагу и в пределах [min, max]. */
export function snapTime(
  value: string,
  step: number,
  minMinutes: number,
  maxMinutes: number,
): string {
  const minutes = timeToMinutes(value.length === 5 ? value : `${value.padStart(2, '0')}:00`);
  if (minutes === null) return '';
  const snapped = Math.round(minutes / step) * step;
  const clamped = Math.min(Math.max(snapped, minMinutes), maxMinutes);
  return minutesToTime(clamped);
}

export function stepTime(
  value: string,
  deltaSteps: number,
  step: number,
  minMinutes: number,
  maxMinutes: number,
): string {
  const current = timeToMinutes(value) ?? minMinutes;
  const next = current + deltaSteps * step;
  const aligned = Math.round(next / step) * step;
  return minutesToTime(Math.min(Math.max(aligned, minMinutes), maxMinutes));
}
