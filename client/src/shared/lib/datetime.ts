import { DateTime } from 'luxon';

/** Вынесено отдельно, чтобы мокать в тестах */
export function now(): DateTime {
  return DateTime.now();
}

export function roundUpToStep(minutes: number, step: number): number {
  return Math.ceil(minutes / step) * step;
}

export function zonedIso(dateIso: string, timeHHmm: string, zone: string): string {
  const [hour, minute] = timeHHmm.split(':').map(Number);
  const dt = DateTime.fromISO(dateIso, { zone }).set({
    hour: hour ?? 0,
    minute: minute ?? 0,
    second: 0,
    millisecond: 0,
  });
  return dt.toISO({ suppressMilliseconds: true }) ?? '';
}

/** Сохраняет исходный офсет строки */
export function addMinutesIso(iso: string, minutes: number): string {
  return (
    DateTime.fromISO(iso, { setZone: true })
      .plus({ minutes })
      .toISO({ suppressMilliseconds: true }) ?? ''
  );
}

/** «HH:mm» ближайшего будущего слота в зоне, округлённого вверх по шагу */
export function nextSlotTime(zone: string, step: number, reference: DateTime = now()): string {
  const local = reference.setZone(zone);
  const minutes = roundUpToStep(local.hour * 60 + local.minute, step);
  const clamped = Math.min(minutes, 23 * 60 + 45);
  return DateTime.fromObject({ hour: Math.floor(clamped / 60), minute: clamped % 60 }).toFormat(
    'HH:mm',
  );
}

export function formatTimeInZone(iso: string, zone: string): string {
  return DateTime.fromISO(iso).setZone(zone).toFormat('HH:mm');
}

export function dayBoundsIso(dateIso: string, zone: string): { from: string; to: string } {
  const start = DateTime.fromISO(dateIso, { zone }).startOf('day');
  return {
    from: start.toISO({ suppressMilliseconds: true }) ?? '',
    to: start.plus({ days: 1 }).toISO({ suppressMilliseconds: true }) ?? '',
  };
}

export function minutesOfDayInZone(iso: string, zone: string): number {
  const dt = DateTime.fromISO(iso).setZone(zone);
  return dt.hour * 60 + dt.minute;
}

/** Месяц прописью и число для «плашки» в списке броней */
export function dayCellParts(iso: string, zone: string): { month: string; day: string } {
  const dt = DateTime.fromISO(iso).setZone(zone).setLocale('ru');
  return { month: dt.toFormat('LLLL').toUpperCase(), day: dt.toFormat('d') };
}

/** «Четверг, 24 октября» */
export function formatDateInZone(iso: string, zone: string): string {
  const dt = DateTime.fromISO(iso).setZone(zone).setLocale('ru');
  const weekday = dt.toFormat('cccc');
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${dt.toFormat('d MMMM')}`;
}

/** Например, «MSK» */
export function zoneAbbr(zone: string, reference: DateTime = now()): string {
  return reference.setZone(zone).toFormat('ZZZZ');
}
