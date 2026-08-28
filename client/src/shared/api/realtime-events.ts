import type { BookingView } from './types';

export interface RoomAvailabilityChangedData {
  roomId: string;
  officeId: string;
  startsAt: string;
  endsAt: string;
  available: boolean;
}

export type RealtimeEvent =
  | { type: 'booking.created'; occurredAt: string; data: { booking: BookingView } }
  | { type: 'booking.cancelled'; occurredAt: string; data: { booking: BookingView } }
  | { type: 'room.availability_changed'; occurredAt: string; data: RoomAvailabilityChangedData }
  | { type: 'data.reset'; occurredAt: string; data: Record<string, never> };

export type RealtimeEventType = RealtimeEvent['type'];

const KNOWN_TYPES = new Set<string>([
  'booking.created',
  'booking.cancelled',
  'room.availability_changed',
  'data.reset',
]);

export function parseRealtimeEvent(raw: string): RealtimeEvent | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null || !('type' in parsed)) {
    return null;
  }
  const { type } = parsed;
  if (typeof type !== 'string' || !KNOWN_TYPES.has(type)) {
    return null;
  }
  return parsed as RealtimeEvent;
}
