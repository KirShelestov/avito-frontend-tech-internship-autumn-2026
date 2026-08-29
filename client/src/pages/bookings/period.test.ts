import { describe, expect, it } from 'vitest';
import { toBookingView } from '@/shared/test/fixtures';
import { filterByPeriod, isBookingPeriod } from './period';

const NOW = new Date('2026-10-15T12:00:00Z');

const at = (id: string, iso: string) =>
  toBookingView({
    id,
    roomId: 'room-everest',
    userId: 'user-konstantin',
    title: id,
    comment: null,
    startsAt: iso,
    endsAt: iso,
    createdAt: '2026-10-01T00:00:00Z',
  });

const upcoming = [at('soon', '2026-10-17T10:00:00Z'), at('later', '2026-11-01T10:00:00Z')];
const past = [at('recent', '2026-10-13T10:00:00Z'), at('old', '2026-09-01T10:00:00Z')];

describe('filterByPeriod', () => {
  it('«за все время» ничего не режет', () => {
    expect(filterByPeriod(upcoming, 'all', 'upcoming', NOW)).toBe(upcoming);
  });

  it('для предстоящих оставляет брони в пределах периода вперёд', () => {
    expect(filterByPeriod(upcoming, 'week', 'upcoming', NOW)?.map((b) => b.id)).toEqual(['soon']);
    expect(filterByPeriod(upcoming, 'month', 'upcoming', NOW)?.map((b) => b.id)).toEqual([
      'soon',
      'later',
    ]);
  });

  it('для прошедших смотрит назад', () => {
    expect(filterByPeriod(past, 'week', 'past', NOW)?.map((b) => b.id)).toEqual(['recent']);
  });

  it('распознаёт значение из URL', () => {
    expect(isBookingPeriod('week')).toBe(true);
    expect(isBookingPeriod('year')).toBe(false);
    expect(isBookingPeriod(null)).toBe(false);
  });
});
