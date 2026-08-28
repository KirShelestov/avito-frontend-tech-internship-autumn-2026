/** Доменные типы API. Совпадают с ответами бэкенда из `server/`. */

export interface User {
  id: string;
  login: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  initials: string;
}

export interface Office {
  id: string;
  name: string;
  address: string;
  /** IANA-таймзона, напр. `Europe/Moscow` */
  timezone: string;
}

export interface RoomFeature {
  code: string;
  name: string;
}

export interface Room {
  id: string;
  officeId: string;
  name: string;
  floor: number;
  capacity: number;
  features: RoomFeature[];
}

export interface RoomSummary extends Room {
  office: Office;
  /** Приходит только если запрос содержит интервал `from`/`to` */
  available?: boolean;
}

export interface BookingView {
  id: string;
  roomId: string;
  userId: string;
  title: string;
  comment: string | null;
  /** ISO 8601 с офсетом */
  startsAt: string;
  endsAt: string;
  createdAt: string;
  room: Room;
  office: Office;
  owner: User;
}

export interface ItemsResponse<T> {
  items: T[];
}

export type BookingScope = 'upcoming' | 'past' | 'all';

export interface ListRoomsParams {
  officeId: string;
  minCapacity?: number;
  /** `from` и `to` указываются только вместе */
  from?: string;
  to?: string;
}

export interface RoomScheduleParams {
  roomId: string;
  from: string;
  to: string;
}

export interface ListBookingsParams {
  scope?: BookingScope;
  officeId?: string;
}

export interface CreateBookingPayload {
  roomId: string;
  title: string;
  comment?: string | null;
  startsAt: string;
  endsAt: string;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
