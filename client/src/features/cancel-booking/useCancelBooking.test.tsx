import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import type { BookingView, ItemsResponse } from '@/shared/api';
import { queryKeys } from '@/shared/api';
import { env } from '@/shared/config/env';
import { ToastProvider } from '@/shared/ui/toast';
import { setupMswServer } from '@/shared/test/setup-msw';
import { mswServer } from '@/shared/test/msw/server';
import { useCancelBooking } from './useCancelBooking';

setupMswServer();

const booking = {
  id: 'booking-future-current-user',
  roomId: 'room-everest',
  title: 'Ежедневная встреча команды',
  userId: 'user-konstantin',
  office: { id: 'office-moscow', timezone: 'Europe/Moscow' },
} as BookingView;

const otherBooking = { ...booking, id: 'other', title: 'Другая' };

function setup() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const listKey = queryKeys.myBookings('upcoming');
  queryClient.setQueryData<ItemsResponse<BookingView>>(listKey, {
    items: [booking, otherBooking],
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );

  const { result } = renderHook(() => useCancelBooking(), { wrapper });
  const readList = () =>
    queryClient.getQueryData<ItemsResponse<BookingView>>(listKey)?.items.map((b) => b.id) ?? [];

  return { result, readList };
}

describe('useCancelBooking', () => {
  it('оптимистично убирает бронь из кэша сразу', async () => {
    const { result, readList } = setup();

    result.current.mutate(booking);

    await waitFor(() => {
      expect(readList()).toEqual(['other']);
    });
  });

  it('при ошибке возвращает бронь в список', async () => {
    mswServer.use(
      http.delete(
        `${env.apiUrl}/api/v1/bookings/:id`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    );
    const { result, readList } = setup();

    result.current.mutate(booking);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    await waitFor(() => {
      expect(readList()).toContain('booking-future-current-user');
    });
  });

  it('повторная отмена той же брони не ломает кэш (идемпотентность)', async () => {
    const { result, readList } = setup();

    result.current.mutate(booking);
    result.current.mutate(booking);

    await waitFor(() => {
      expect(readList()).toEqual(['other']);
    });
  });
});
