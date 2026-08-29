import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';
import type { BookingView } from '@/shared/api';
import { buildIcsCalendar, foldLine, icsFileName } from './ics';

const NOW = DateTime.fromISO('2026-10-20T09:00:00Z');

const booking = (over: Partial<BookingView> = {}): BookingView => ({
  id: 'b1',
  roomId: 'room-everest',
  userId: 'u1',
  title: 'Daily Sync',
  comment: null,
  startsAt: '2026-10-24T15:00:00+03:00',
  endsAt: '2026-10-24T16:00:00+03:00',
  createdAt: '2026-10-20T00:00:00+03:00',
  room: {
    id: 'room-everest',
    officeId: 'o',
    name: 'Эверест',
    floor: 4,
    capacity: 12,
    features: [],
  },
  office: { id: 'o', name: 'Офис Москва', address: 'ул. Лесная, 7', timezone: 'Europe/Moscow' },
  owner: {
    id: 'u1',
    login: 'k',
    displayName: 'К',
    email: 'k@e.t',
    avatarUrl: null,
    initials: 'К',
  },
  ...over,
});

describe('buildIcsCalendar', () => {
  it('формирует корректный VCALENDAR с VEVENT', () => {
    const ics = buildIcsCalendar([booking()], { now: NOW });
    const lines = ics.split('\r\n');

    expect(lines[0]).toBe('BEGIN:VCALENDAR');
    expect(lines).toContain('VERSION:2.0');
    expect(lines).toContain('BEGIN:VEVENT');
    expect(lines).toContain('UID:b1@bookroom');
    expect(lines).toContain('DTSTAMP:20261020T090000Z');
    // 15:00 +03:00 => 12:00 UTC
    expect(lines).toContain('DTSTART:20261024T120000Z');
    expect(lines).toContain('DTEND:20261024T130000Z');
    expect(lines).toContain('SUMMARY:Daily Sync');
    expect(lines).toContain('LOCATION:Эверест\\, Офис Москва\\, 4 этаж');
    expect(lines.at(-2)).toBe('END:VCALENDAR');
    expect(ics.endsWith('\r\n')).toBe(true);
  });

  it('добавляет DESCRIPTION только при наличии комментария и экранирует спецсимволы', () => {
    const withComment = buildIcsCalendar([booking({ comment: 'Пункт 1; пункт 2\nстрока 3' })], {
      now: NOW,
    });
    expect(withComment).toContain('DESCRIPTION:Пункт 1\\; пункт 2\\nстрока 3');

    const withoutComment = buildIcsCalendar([booking()], { now: NOW });
    expect(withoutComment).not.toContain('DESCRIPTION:');
  });

  it('поддерживает несколько встреч', () => {
    const ics = buildIcsCalendar([booking({ id: 'a' }), booking({ id: 'b' })], { now: NOW });
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(ics).toContain('UID:a@bookroom');
    expect(ics).toContain('UID:b@bookroom');
  });
});

describe('foldLine', () => {
  it('короткую строку не трогает', () => {
    expect(foldLine('SUMMARY:Короткая')).toBe('SUMMARY:Короткая');
  });

  it('длинную строку сворачивает по 75 октетов с ведущим пробелом', () => {
    const long = `DESCRIPTION:${'a'.repeat(200)}`;
    const folded = foldLine(long);
    const parts = folded.split('\r\n ');
    expect(parts.length).toBeGreaterThan(1);
    expect(Buffer.byteLength(parts[0]!)).toBeLessThanOrEqual(75);
  });
});

describe('icsFileName', () => {
  it('делает безопасный slug с расширением .ics', () => {
    expect(icsFileName('Daily Sync: Разработка & Продукт')).toBe(
      'daily-sync-разработка-продукт.ics',
    );
    expect(icsFileName('   ')).toBe('bookings.ics');
  });
});
