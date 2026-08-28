import { http, HttpResponse } from 'msw';
import type { ApiErrorBody, CreateBookingPayload } from '@/shared/api/types';
import { env } from '@/shared/config/env';
import { currentUser, offices, officeById, roomById, rooms, toBookingView } from '../fixtures';
import { db, overlaps, resetDb } from './db';

const API = `${env.apiUrl}/api/v1`;

const apiError = (
  status: number,
  code: string,
  message: string,
  details?: Record<string, unknown>,
) =>
  HttpResponse.json<ApiErrorBody>(
    { error: { code, message, ...(details ? { details } : {}) } },
    { status },
  );

export const handlers = [
  http.get(`${API}/me`, () => HttpResponse.json(currentUser)),

  http.get(`${API}/offices`, () => HttpResponse.json({ items: offices })),

  http.get(`${API}/rooms`, ({ request }) => {
    const url = new URL(request.url);
    const officeId = url.searchParams.get('officeId');
    if (!officeId) {
      return apiError(400, 'VALIDATION_ERROR', 'Укажите офис');
    }
    if (!officeById(officeId)) {
      return apiError(404, 'OFFICE_NOT_FOUND', 'Офис не найден');
    }
    const minCapacity = url.searchParams.get('minCapacity');
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    if (Boolean(from) !== Boolean(to)) {
      return apiError(
        400,
        'VALIDATION_ERROR',
        'Начало и окончание интервала необходимо указать вместе',
      );
    }

    const items = rooms
      .filter((room) => room.officeId === officeId)
      .filter((room) => minCapacity == null || room.capacity >= Number(minCapacity))
      .map((room) => {
        const office = officeById(room.officeId)!;
        if (!from || !to) return { ...room, office };
        const busy = db.bookings.some(
          (b) => b.roomId === room.id && overlaps(b.startsAt, b.endsAt, from, to),
        );
        return { ...room, office, available: !busy };
      });
    return HttpResponse.json({ items });
  }),

  http.get(`${API}/rooms/:roomId`, ({ params }) => {
    const room = roomById(String(params.roomId));
    if (!room) return apiError(404, 'ROOM_NOT_FOUND', 'Переговорная не найдена');
    return HttpResponse.json({ ...room, office: officeById(room.officeId)! });
  }),

  http.get(`${API}/rooms/:roomId/bookings`, ({ params, request }) => {
    const room = roomById(String(params.roomId));
    if (!room) return apiError(404, 'ROOM_NOT_FOUND', 'Переговорная не найдена');
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    if (!from || !to) return apiError(400, 'INVALID_DATE_RANGE', 'Укажите интервал');

    const items = db.bookings
      .filter((b) => b.roomId === room.id && overlaps(b.startsAt, b.endsAt, from, to))
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
      .map(toBookingView);
    return HttpResponse.json({ items });
  }),

  http.get(`${API}/bookings`, ({ request }) => {
    const url = new URL(request.url);
    const scope = url.searchParams.get('scope') ?? 'upcoming';
    const officeId = url.searchParams.get('officeId');
    const now = Date.now();

    let items = db.bookings.filter((b) => b.userId === db.currentUserId);
    if (scope === 'upcoming') items = items.filter((b) => new Date(b.startsAt).getTime() > now);
    if (scope === 'past') items = items.filter((b) => new Date(b.startsAt).getTime() <= now);
    if (officeId) items = items.filter((b) => roomById(b.roomId)?.officeId === officeId);

    const dir = scope === 'past' ? -1 : 1;
    items = [...items].sort(
      (a, b) => dir * (new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
    );
    return HttpResponse.json({ items: items.map(toBookingView) });
  }),

  http.post(`${API}/bookings`, async ({ request }) => {
    const body = (await request.json()) as CreateBookingPayload;
    const room = roomById(body.roomId);
    if (!room) return apiError(404, 'ROOM_NOT_FOUND', 'Переговорная не найдена');

    if (new Date(body.startsAt).getTime() <= Date.now()) {
      return apiError(400, 'START_NOT_IN_FUTURE', 'Бронирование можно создать только на будущее');
    }
    const conflict = db.bookings.some(
      (b) => b.roomId === room.id && overlaps(b.startsAt, b.endsAt, body.startsAt, body.endsAt),
    );
    if (conflict) {
      return apiError(
        409,
        'BOOKING_CONFLICT',
        'Переговорная уже забронирована на выбранное время',
        {
          roomId: room.id,
        },
      );
    }

    const raw = {
      id: `booking-${String(Date.now())}`,
      roomId: room.id,
      userId: db.currentUserId,
      title: body.title.trim(),
      comment: body.comment?.trim() || null,
      startsAt: body.startsAt,
      endsAt: body.endsAt,
      createdAt: new Date().toISOString(),
    };
    db.bookings.push(raw);
    return HttpResponse.json(toBookingView(raw), { status: 201 });
  }),

  http.delete(`${API}/bookings/:bookingId`, ({ params }) => {
    const id = String(params.bookingId);
    const booking = db.bookings.find((b) => b.id === id);
    if (!booking) return apiError(404, 'BOOKING_NOT_FOUND', 'Бронирование не найдено');
    if (booking.userId !== db.currentUserId) {
      return apiError(403, 'FORBIDDEN', 'Можно отменять только собственные бронирования');
    }
    if (new Date(booking.startsAt).getTime() <= Date.now()) {
      return apiError(400, 'BOOKING_NOT_CANCELLABLE', 'Можно отменять только будущие бронирования');
    }
    db.bookings = db.bookings.filter((b) => b.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API}/test/reset`, () => {
    resetDb();
    return new HttpResponse(null, { status: 204 });
  }),
];
