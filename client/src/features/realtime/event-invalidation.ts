import type { RealtimeEvent } from '@/shared/api';

/** `data.reset` обрабатывается отдельно, в RealtimeProvider */
export function invalidationsForEvent(event: RealtimeEvent, currentUserId?: string): string[][] {
  switch (event.type) {
    case 'booking.created':
    case 'booking.cancelled': {
      const { booking } = event.data;
      const keys: string[][] = [
        ['room-schedule', booking.roomId],
        ['rooms', booking.office.id],
      ];
      if (currentUserId && booking.userId === currentUserId) {
        keys.push(['my-bookings']);
      }
      return keys;
    }
    case 'room.availability_changed': {
      return [
        ['room-schedule', event.data.roomId],
        ['rooms', event.data.officeId],
      ];
    }
    case 'data.reset':
      return [];
  }
}
