import type { BookingScope, BookingView } from '@/shared/api';

export type BookingPeriod = 'all' | 'week' | 'month';

const PERIOD_DAYS: Record<Exclude<BookingPeriod, 'all'>, number> = { week: 7, month: 30 };

export const isBookingPeriod = (value: string | null): value is BookingPeriod =>
  value === 'all' || value === 'week' || value === 'month';

/** API не умеет фильтровать по периоду, поэтому режем уже загруженный список */
export function filterByPeriod(
  bookings: BookingView[] | undefined,
  period: BookingPeriod,
  scope: BookingScope,
  now: Date = new Date(),
): BookingView[] | undefined {
  if (!bookings || period === 'all') return bookings;
  const span = PERIOD_DAYS[period] * 24 * 60 * 60 * 1000;
  const edge = scope === 'past' ? now.getTime() - span : now.getTime() + span;
  return bookings.filter((booking) => {
    const start = new Date(booking.startsAt).getTime();
    return scope === 'past' ? start >= edge : start <= edge;
  });
}
