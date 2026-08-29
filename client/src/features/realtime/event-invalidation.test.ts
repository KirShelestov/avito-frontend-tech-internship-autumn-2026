import { describe, expect, it } from 'vitest';
import type { BookingView, RealtimeEvent } from '@/shared/api';
import { invalidationsForEvent } from './event-invalidation';

const booking = {
  id: 'b1',
  roomId: 'room-everest',
  userId: 'user-konstantin',
  office: { id: 'office-moscow' },
} as BookingView;

describe('invalidationsForEvent', () => {
  it('booking.created инвалидирует расписание и список комнат', () => {
    const event: RealtimeEvent = {
      type: 'booking.created',
      occurredAt: '',
      data: { booking },
    };
    expect(invalidationsForEvent(event)).toEqual([
      ['room-schedule', 'room-everest'],
      ['rooms', 'office-moscow'],
    ]);
  });

  it('добавляет my-bookings, если бронь принадлежит текущему пользователю', () => {
    const event: RealtimeEvent = {
      type: 'booking.cancelled',
      occurredAt: '',
      data: { booking },
    };
    expect(invalidationsForEvent(event, 'user-konstantin')).toContainEqual(['my-bookings']);
    expect(invalidationsForEvent(event, 'user-anna')).not.toContainEqual(['my-bookings']);
  });

  it('room.availability_changed инвалидирует расписание и список комнат', () => {
    const event: RealtimeEvent = {
      type: 'room.availability_changed',
      occurredAt: '',
      data: {
        roomId: 'room-kazbek',
        officeId: 'office-moscow',
        startsAt: '',
        endsAt: '',
        available: false,
      },
    };
    expect(invalidationsForEvent(event)).toEqual([
      ['room-schedule', 'room-kazbek'],
      ['rooms', 'office-moscow'],
    ]);
  });

  it('data.reset не даёт точечных инвалидаций', () => {
    expect(invalidationsForEvent({ type: 'data.reset', occurredAt: '', data: {} })).toEqual([]);
  });
});
