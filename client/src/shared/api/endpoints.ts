import { request } from './http';
import type {
  BookingView,
  CreateBookingPayload,
  ItemsResponse,
  ListBookingsParams,
  ListRoomsParams,
  Office,
  RoomScheduleParams,
  RoomSummary,
  User,
} from './types';

export const api = {
  getMe: (signal?: AbortSignal) => request<User>('/api/v1/me', { signal }),

  listOffices: (signal?: AbortSignal) =>
    request<ItemsResponse<Office>>('/api/v1/offices', { signal }),

  listRooms: (params: ListRoomsParams, signal?: AbortSignal) =>
    request<ItemsResponse<RoomSummary>>('/api/v1/rooms', {
      query: {
        officeId: params.officeId,
        minCapacity: params.minCapacity,
        from: params.from,
        to: params.to,
      },
      signal,
    }),

  getRoom: (roomId: string, signal?: AbortSignal) =>
    request<RoomSummary>(`/api/v1/rooms/${encodeURIComponent(roomId)}`, { signal }),

  getRoomSchedule: (params: RoomScheduleParams, signal?: AbortSignal) =>
    request<ItemsResponse<BookingView>>(
      `/api/v1/rooms/${encodeURIComponent(params.roomId)}/bookings`,
      { query: { from: params.from, to: params.to }, signal },
    ),

  listBookings: (params: ListBookingsParams = {}, signal?: AbortSignal) =>
    request<ItemsResponse<BookingView>>('/api/v1/bookings', {
      query: { scope: params.scope, officeId: params.officeId },
      signal,
    }),

  createBooking: (payload: CreateBookingPayload, signal?: AbortSignal) =>
    request<BookingView>('/api/v1/bookings', { method: 'POST', body: payload, signal }),

  cancelBooking: (bookingId: string, signal?: AbortSignal) =>
    request<void>(`/api/v1/bookings/${encodeURIComponent(bookingId)}`, {
      method: 'DELETE',
      signal,
    }),
};
