import { Server, WebSocket as MockWebSocket } from 'mock-socket';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRealtimeClient, type RealtimeStatus } from './ws';

const URL = 'ws://localhost:1234/api/v1/ws';
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let servers: Server[] = [];

function makeServer(): Server {
  const server = new Server(URL);
  servers.push(server);
  return server;
}

afterEach(() => {
  for (const server of servers) server.stop();
  servers = [];
});

describe('createRealtimeClient', () => {
  it('подключается, сообщает статус open и передаёт события', async () => {
    const server = makeServer();
    const statuses: RealtimeStatus[] = [];
    const onEvent = vi.fn();

    const client = createRealtimeClient({
      url: URL,
      onEvent,
      onStatusChange: (s) => statuses.push(s),
      WebSocketImpl: MockWebSocket,
      backoffMs: [10],
      jitter: () => 0,
    });

    await vi.waitFor(() => expect(client.getStatus()).toBe('open'));
    expect(statuses).toContain('open');

    server.emit(
      'message',
      JSON.stringify({
        type: 'booking.created',
        occurredAt: '2026-08-18T09:00:00.000Z',
        data: { booking: { id: 'b1' } },
      }),
    );

    await vi.waitFor(() => expect(onEvent).toHaveBeenCalledTimes(1));
    expect(onEvent).toHaveBeenCalledWith(expect.objectContaining({ type: 'booking.created' }));

    client.close();
  });

  it('по умолчанию не рвёт тихое соединение', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    makeServer();
    const statuses: RealtimeStatus[] = [];
    const client = createRealtimeClient({
      url: URL,
      onStatusChange: (s) => statuses.push(s),
      WebSocketImpl: MockWebSocket,
      jitter: () => 0,
    });
    try {
      await vi.waitFor(() => expect(client.getStatus()).toBe('open'));

      await vi.advanceTimersByTimeAsync(5 * 60_000);

      expect(client.getStatus()).toBe('open');
      expect(statuses).toEqual(['open']);
    } finally {
      client.close();
      vi.useRealTimers();
    }
  });

  it('с heartbeatTimeoutMs переподключается после тишины', async () => {
    makeServer();
    const statuses: RealtimeStatus[] = [];
    const client = createRealtimeClient({
      url: URL,
      onStatusChange: (s) => statuses.push(s),
      WebSocketImpl: MockWebSocket,
      heartbeatTimeoutMs: 30,
      backoffMs: [10],
      jitter: () => 0,
    });

    await vi.waitFor(() => expect(statuses.filter((s) => s === 'open')).toHaveLength(2));
    client.close();
  });

  it('после внезапного обрыва переходит в connecting и переподключается', async () => {
    const server = makeServer();
    const client = createRealtimeClient({
      url: URL,
      WebSocketImpl: MockWebSocket,
      backoffMs: [10],
      jitter: () => 0,
    });

    await vi.waitFor(() => expect(client.getStatus()).toBe('open'));

    server.close();
    server.stop();
    servers = [];
    await vi.waitFor(() => expect(client.getStatus()).toBe('connecting'));

    // сервер вернулся, клиент должен переподключиться сам
    makeServer();
    await vi.waitFor(() => expect(client.getStatus()).toBe('open'), { timeout: 1000 });

    client.close();
  });

  it('close() останавливает переподключение', async () => {
    const server = makeServer();
    const client = createRealtimeClient({
      url: URL,
      WebSocketImpl: MockWebSocket,
      backoffMs: [10],
      jitter: () => 0,
    });

    await vi.waitFor(() => expect(client.getStatus()).toBe('open'));

    client.close();
    expect(client.getStatus()).toBe('closed');

    server.close();
    await wait(40);
    expect(client.getStatus()).toBe('closed');
  });
});
