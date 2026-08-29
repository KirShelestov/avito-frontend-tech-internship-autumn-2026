import { DateTime } from 'luxon';
import type { BookingView } from '@/shared/api';

const CRLF = '\r\n';

/** RFC 5545 §3.3.11 */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** `YYYYMMDDTHHMMSSZ` */
function toUtcStamp(iso: string): string {
  return DateTime.fromISO(iso, { setZone: true }).toUTC().toFormat("yyyyLLdd'T'HHmmss'Z'");
}

/** Свёртка по 75 октетов, строки продолжения начинаются с пробела (RFC 5545 §3.1) */
export function foldLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;

  const chunks: string[] = [];
  let current = '';
  let limit = 75;
  for (const char of line) {
    if (encoder.encode(current + char).length > limit) {
      chunks.push(current);
      current = char;
      limit = 74;
    } else {
      current += char;
    }
  }
  if (current) chunks.push(current);
  return chunks.join(`${CRLF} `);
}

function event(booking: BookingView, dtstamp: string): string[] {
  const location = `${booking.room.name}, ${booking.office.name}, ${booking.room.floor} этаж`;
  return [
    'BEGIN:VEVENT',
    `UID:${booking.id}@bookroom`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${toUtcStamp(booking.startsAt)}`,
    `DTEND:${toUtcStamp(booking.endsAt)}`,
    `SUMMARY:${escapeText(booking.title)}`,
    `LOCATION:${escapeText(location)}`,
    ...(booking.comment ? [`DESCRIPTION:${escapeText(booking.comment)}`] : []),
    'END:VEVENT',
  ];
}

export interface BuildIcsOptions {
  /** Значение DTSTAMP, по умолчанию текущий момент */
  now?: DateTime;
}

export function buildIcsCalendar(
  bookings: BookingView[],
  { now = DateTime.now() }: BuildIcsOptions = {},
): string {
  const dtstamp = now.toUTC().toFormat("yyyyLLdd'T'HHmmss'Z'");
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BookRoom//RU',
    'CALSCALE:GREGORIAN',
    ...bookings.flatMap((booking) => event(booking, dtstamp)),
    'END:VCALENDAR',
  ];
  return lines.map(foldLine).join(CRLF) + CRLF;
}

export function icsFileName(base: string): string {
  const slug = base
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `${slug || 'bookings'}.ics`;
}
