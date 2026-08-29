import { test as base, expect, type APIRequestContext } from '@playwright/test';

const BACKEND = 'http://localhost:3000';

export async function resetBackend(request: APIRequestContext): Promise<void> {
  const response = await request.post(`${BACKEND}/api/v1/test/reset`);
  expect(response.ok()).toBeTruthy();
}

/** Создаёт бронь напрямую через API для проверки конфликтов и real-time */
export async function bookViaApi(
  request: APIRequestContext,
  params: { roomId: string; title: string; startsAt: string; endsAt: string },
): Promise<void> {
  const response = await request.post(`${BACKEND}/api/v1/bookings`, {
    data: {
      roomId: params.roomId,
      title: params.title,
      startsAt: params.startsAt,
      endsAt: params.endsAt,
    },
  });
  expect(response.status(), await response.text()).toBe(201);
}

const pad = (n: number) => String(n).padStart(2, '0');

export function futureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** В московском офсете (+03:00) */
export function futureIso(days: number, hour: number, minute = 0): string {
  return `${futureDate(days)}T${pad(hour)}:${pad(minute)}:00+03:00`;
}

export const test = base.extend({});
export { expect };
