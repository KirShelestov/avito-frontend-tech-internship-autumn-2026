import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import type { CreateBookingPayload } from '@/shared/api';
import { env } from '@/shared/config/env';
import { addDaysISO, todayISODate } from '@/shared/lib/date';
import { setupMswServer } from '@/shared/test/setup-msw';
import { mswServer } from '@/shared/test/msw/server';
import { createBookingSeries, type SeriesItemInput } from './createSeries';

setupMswServer();

const payload = (day: string): CreateBookingPayload => ({
  roomId: 'room-altai',
  title: `Планёрка ${day}`,
  comment: null,
  startsAt: `${day}T10:00:00+03:00`,
  endsAt: `${day}T11:00:00+03:00`,
});

const today = todayISODate('Europe/Moscow');
const days = [addDaysISO(today, 3), addDaysISO(today, 4), addDaysISO(today, 5)];
const items: SeriesItemInput[] = days.map((day) => ({ date: day, payload: payload(day) }));

describe('createBookingSeries', () => {
  it('создаёт все брони при успехе', async () => {
    const results = await createBookingSeries(items);
    expect(results.map((r) => r.status)).toEqual(['created', 'created', 'created']);
  });

  it('помечает конфликтные даты, не прерывая серию', async () => {
    let call = 0;
    mswServer.use(
      http.post(`${env.apiUrl}/api/v1/bookings`, () => {
        call += 1;
        if (call === 2) {
          return HttpResponse.json(
            { error: { code: 'BOOKING_CONFLICT', message: 'занято' } },
            { status: 409 },
          );
        }
        return HttpResponse.json({ id: `b${String(call)}` }, { status: 201 });
      }),
    );

    const results = await createBookingSeries(items);
    const byStatus = results.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    }, {});
    expect(byStatus.created).toBe(2);
    expect(byStatus.conflict).toBe(1);
  });

  it('прочие ошибки помечаются как error', async () => {
    mswServer.use(
      http.post(`${env.apiUrl}/api/v1/bookings`, () => new HttpResponse(null, { status: 500 })),
    );
    const results = await createBookingSeries([items[0]!]);
    expect(results[0]!.status).toBe('error');
  });

  it('вызывает onProgress', async () => {
    const progress: number[] = [];
    await createBookingSeries(items, (done) => progress.push(done));
    expect(progress.at(-1)).toBe(3);
  });
});
