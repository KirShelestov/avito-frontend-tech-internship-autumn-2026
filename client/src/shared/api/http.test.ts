import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpError, NetworkError } from './errors';
import { request } from './http';

const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...init,
  });

describe('request', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it('возвращает разобранный JSON при 200', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ items: [1, 2, 3] }));

    await expect(request('/api/v1/offices')).resolves.toEqual({ items: [1, 2, 3] });
  });

  it('добавляет query-параметры и пропускает undefined', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ items: [] }));

    await request('/api/v1/rooms', {
      query: { officeId: 'office-moscow', minCapacity: 8, from: undefined },
    });

    const calledUrl = new URL(fetchMock.mock.calls[0]![0] as string);
    expect(calledUrl.pathname).toBe('/api/v1/rooms');
    expect(calledUrl.searchParams.get('officeId')).toBe('office-moscow');
    expect(calledUrl.searchParams.get('minCapacity')).toBe('8');
    expect(calledUrl.searchParams.has('from')).toBe(false);
  });

  it('сериализует тело и ставит content-type для POST', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 'b1' }, { status: 201 }));

    await request('/api/v1/bookings', { method: 'POST', body: { title: 'Sync' } });

    const init = fetchMock.mock.calls[0]![1] as RequestInit;
    expect(init.method).toBe('POST');
    expect(init.body).toBe('{"title":"Sync"}');
    expect(init.headers).toMatchObject({ 'content-type': 'application/json' });
  });

  it('возвращает undefined при 204', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

    await expect(request('/api/v1/bookings/b1', { method: 'DELETE' })).resolves.toBeUndefined();
  });

  it('бросает HttpError с кодом и деталями из тела', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(
        {
          error: {
            code: 'BOOKING_CONFLICT',
            message: 'Переговорная уже забронирована на выбранное время',
            details: { roomId: 'room-everest' },
          },
        },
        { status: 409 },
      ),
    );

    const error = await request('/api/v1/bookings', { method: 'POST', body: {} }).catch(
      (e: unknown) => e,
    );
    expect(error).toBeInstanceOf(HttpError);
    expect(error).toMatchObject({ status: 409, code: 'BOOKING_CONFLICT' });
    expect((error as HttpError).details).toEqual({ roomId: 'room-everest' });
    expect((error as HttpError).isConflict).toBe(true);
  });

  it('бросает HttpError UNKNOWN, если тело не в формате API', async () => {
    fetchMock.mockResolvedValueOnce(new Response('gateway error', { status: 502 }));

    const error = await request('/api/v1/rooms').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(HttpError);
    expect(error).toMatchObject({ status: 502, code: 'UNKNOWN' });
  });

  it('бросает NetworkError при сбое соединения', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(request('/api/v1/me')).rejects.toBeInstanceOf(NetworkError);
  });

  it('пробрасывает AbortError без обёртки', async () => {
    fetchMock.mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'));

    const error = await request('/api/v1/me').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(DOMException);
    expect((error as DOMException).name).toBe('AbortError');
  });
});
