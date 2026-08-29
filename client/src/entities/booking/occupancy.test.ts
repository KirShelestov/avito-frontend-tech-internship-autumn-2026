import { describe, expect, it } from 'vitest';
import { toBookingView } from '@/shared/test/fixtures';
import { roomOccupancy } from './occupancy';

const booking = (id: string, start: string, end: string) =>
  toBookingView({
    id,
    roomId: 'room-everest',
    userId: 'user-konstantin',
    title: id,
    comment: null,
    startsAt: `2026-10-24T${start}:00+03:00`,
    endsAt: `2026-10-24T${end}:00+03:00`,
    createdAt: '2026-10-01T00:00:00Z',
  });

const SLOT = '2026-10-24T15:00:00+03:00';

describe('roomOccupancy', () => {
  it('без броней комната свободна весь день', () => {
    expect(roomOccupancy([], SLOT)).toEqual({ kind: 'free-all-day' });
  });

  it('идущая бронь даёт «занята до» с учётом стыкующихся броней', () => {
    const result = roomOccupancy(
      [booking('b', '15:30', '16:00'), booking('a', '14:00', '15:30')],
      SLOT,
    );
    expect(result).toEqual({ kind: 'busy-until', until: '2026-10-24T16:00:00+03:00' });
  });

  it('бронь, закончившаяся ровно к началу слота, тоже считается', () => {
    expect(roomOccupancy([booking('a', '14:00', '15:00')], SLOT)).toEqual({
      kind: 'busy-until',
      until: '2026-10-24T15:00:00+03:00',
    });
  });

  it('если сейчас свободно, показывает время следующей брони', () => {
    expect(roomOccupancy([booking('a', '17:00', '18:00')], SLOT)).toEqual({
      kind: 'free-until',
      until: '2026-10-24T17:00:00+03:00',
    });
  });

  it('если все брони уже прошли, свободна до конца дня', () => {
    expect(roomOccupancy([booking('a', '10:00', '11:00')], SLOT)).toEqual({
      kind: 'free-rest-of-day',
    });
  });
});
