import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { Server, WebSocket as MockWebSocket } from 'mock-socket';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConnectionStatusBanner } from './ConnectionStatusBanner';
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
          <ConnectionStatusBanner />
          <StatusProbe />
        </RealtimeProvider>
      </ToastProvider>
    </QueryClientProvider>,
  );

  return { queryClient, invalidateSpy, clearSpy };
}

describe('RealtimeProvider', () => {
  it('не переподключается, когда догружается профиль', async () => {
    let connections = 0;
    server.on('connection', () => {
      connections += 1;
    });
    const { queryClient, invalidateSpy } = renderProvider();
    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('open');
    });

    queryClient.setQueryData(['me'], { id: 'u1', displayName: 'Константин Кузнецов' });
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(connections).toBe(1);
    expect(screen.getByTestId('status')).toHaveTextContent('open');
    expect(invalidateSpy).not.toHaveBeenCalled();
  });

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

  it('после разрыва показывает баннер и переподключается с resync', async () => {
    const { invalidateSpy } = renderProvider();
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('open'));
    expect(screen.queryByRole('status', { name: /Соединение потеряно/ })).not.toBeInTheDocument();

    server.close();
    server.stop();

    expect(await screen.findByText('Соединение потеряно. Переподключение…')).toBeInTheDocument();

    invalidateSpy.mockClear();
    server = new Server(WS_URL);

    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('open'));
    await waitFor(() => {
      // resync: инвалидация без конкретного ключа
      expect(invalidateSpy).toHaveBeenCalledWith({ refetchType: 'active' });
    });
    expect(screen.queryByText('Соединение потеряно. Переподключение…')).not.toBeInTheDocument();
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
