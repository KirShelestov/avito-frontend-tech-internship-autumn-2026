import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { Server, WebSocket as MockWebSocket } from 'mock-socket';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider } from '@/shared/ui/toast';
import { RealtimeProvider } from './RealtimeProvider';
import { useRealtimeStatus } from './realtime-context';

const WS_URL = 'ws://localhost:9931/api/v1/ws';

function StatusProbe() {
  return <span data-testid="status">{useRealtimeStatus()}</span>;
}

let server: Server;

beforeEach(() => {
  // useMe ходит в сеть, глушим его
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.reject(new Error('offline'))),
  );
  server = new Server(WS_URL);
});

afterEach(() => {
  server.stop();
  vi.unstubAllGlobals();
});

function renderProvider() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
  const clearSpy = vi.spyOn(queryClient, 'clear');

  render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RealtimeProvider url={WS_URL} webSocketImpl={MockWebSocket}>
          <StatusProbe />
        </RealtimeProvider>
      </ToastProvider>
    </QueryClientProvider>,
  );

  return { invalidateSpy, clearSpy };
}

describe('RealtimeProvider', () => {
  it('подключается и отдаёт статус open', async () => {
    renderProvider();
    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('open');
    });
  });

  it('по booking.created инвалидирует расписание и список комнат', async () => {
    const { invalidateSpy } = renderProvider();
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('open'));

    server.emit(
      'message',
      JSON.stringify({
        type: 'booking.created',
        occurredAt: '2026-08-18T09:00:00.000Z',
        data: {
          booking: {
            id: 'b1',
            roomId: 'room-everest',
            userId: 'u1',
            office: { id: 'office-moscow' },
          },
        },
      }),
    );

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ['room-schedule', 'room-everest'] }),
      );
    });
  });

  it('по data.reset очищает кэш', async () => {
    const { clearSpy } = renderProvider();
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('open'));

    server.emit(
      'message',
      JSON.stringify({ type: 'data.reset', occurredAt: '2026-08-18T09:00:00.000Z', data: {} }),
    );

    await waitFor(() => {
      expect(clearSpy).toHaveBeenCalled();
    });
    // тост об обновлении данных
    expect(await screen.findByText('Данные обновлены')).toBeInTheDocument();
  });
});
