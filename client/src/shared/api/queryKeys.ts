import type { BookingScope, ListRoomsParams } from './types';

export const queryKeys = {
  me: () => ['me'] as const,
  offices: () => ['offices'] as const,
  rooms: (params: ListRoomsParams) =>
    [
      'rooms',
      params.officeId,
      {
        minCapacity: params.minCapacity ?? null,
        from: params.from ?? null,
        to: params.to ?? null,
      },
    ] as const,
  room: (roomId: string) => ['room', roomId] as const,
  roomSchedule: (roomId: string, dayIso: string) => ['room-schedule', roomId, dayIso] as const,
  myBookings: (scope: BookingScope, officeId?: string) =>
    ['my-bookings', scope, officeId ?? null] as const,
};
