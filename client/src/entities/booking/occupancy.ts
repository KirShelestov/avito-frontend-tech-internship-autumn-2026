import type { BookingView } from '@/shared/api';

export type Occupancy =
  | { kind: 'free-all-day' }
  | { kind: 'busy-until'; until: string }
  | { kind: 'free-until'; until: string }
  | { kind: 'free-rest-of-day' };

const ms = (iso: string): number => new Date(iso).getTime();

/**
 * Занятость комнаты относительно начала выбранного слота.
 * Бронь, закончившаяся ровно в момент начала, тоже считается: «Занята до 15:00».
 */
export function roomOccupancy(bookings: BookingView[], slotStartIso: string): Occupancy {
  if (bookings.length === 0) return { kind: 'free-all-day' };

  const sorted = [...bookings].sort((a, b) => ms(a.startsAt) - ms(b.startsAt));
  const slot = ms(slotStartIso);

  const current = sorted.find((b) => ms(b.startsAt) <= slot && ms(b.endsAt) >= slot);
  if (current) {
    let until = current.endsAt;
    for (const next of sorted) {
      if (ms(next.startsAt) <= ms(until) && ms(next.endsAt) > ms(until)) until = next.endsAt;
    }
    return { kind: 'busy-until', until };
  }

  const next = sorted.find((b) => ms(b.startsAt) > slot);
  return next ? { kind: 'free-until', until: next.startsAt } : { kind: 'free-rest-of-day' };
}
