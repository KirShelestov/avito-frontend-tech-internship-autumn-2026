import { parseRealtimeEvent, type RealtimeEvent } from './realtime-events';

export type RealtimeStatus = 'connecting' | 'open' | 'closed';

type WebSocketCtor = new (url: string) => WebSocket;

export interface RealtimeClientOptions {
  url: string;
  onEvent?: (event: RealtimeEvent) => void;
  onStatusChange?: (status: RealtimeStatus) => void;
  /** Задержки переподключения в мс, последнее значение повторяется */
  backoffMs?: number[];
  /**
   * Если сообщений нет дольше этого времени, делаем принудительный реконнект.
   * По умолчанию выключено: бэкенд шлёт только протокольные ping-фреймы,
   * а браузер их в onmessage не отдаёт, и тихое соединение рвалось бы каждые N секунд.
   */
  heartbeatTimeoutMs?: number;
  WebSocketImpl?: WebSocketCtor;
  /** Возвращает число из [0, 1), в тестах подменяется для детерминизма */
  jitter?: () => number;
}

export interface RealtimeClient {
  getStatus: () => RealtimeStatus;
  reconnect: () => void;
  close: () => void;
}

const DEFAULT_BACKOFF = [250, 500, 1000, 2000, 4000, 8000];

export function createRealtimeClient(options: RealtimeClientOptions): RealtimeClient {
  const {
    url,
    onEvent,
    onStatusChange,
    backoffMs = DEFAULT_BACKOFF,
    heartbeatTimeoutMs,
    WebSocketImpl = globalThis.WebSocket,
    jitter = Math.random,
  } = options;

  let socket: WebSocket | null = null;
  let status: RealtimeStatus = 'connecting';
  let attempt = 0;
  let stopped = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
  let heartbeatTimer: ReturnType<typeof setTimeout> | undefined;

  const setStatus = (next: RealtimeStatus) => {
    if (status === next) return;
    status = next;
    onStatusChange?.(next);
  };

  const clearTimers = () => {
    if (reconnectTimer) clearTimeout(reconnectTimer);
    if (heartbeatTimer) clearTimeout(heartbeatTimer);
    reconnectTimer = undefined;
    heartbeatTimer = undefined;
  };

  const armHeartbeat = () => {
    if (heartbeatTimer) clearTimeout(heartbeatTimer);
    if (heartbeatTimeoutMs === undefined) return;
    heartbeatTimer = setTimeout(() => {
      socket?.close();
    }, heartbeatTimeoutMs);
  };

  const scheduleReconnect = () => {
    if (stopped) return;
    const base = backoffMs[Math.min(attempt, backoffMs.length - 1)] ?? 8000;
    const delay = base + Math.floor(jitter() * base * 0.3);
    attempt += 1;
    setStatus('connecting');
    reconnectTimer = setTimeout(connect, delay);
  };

  function connect() {
    if (stopped) return;
    setStatus(status === 'open' ? 'connecting' : status);

    let ws: WebSocket;
    try {
      ws = new WebSocketImpl(url);
    } catch {
      scheduleReconnect();
      return;
    }
    socket = ws;

    ws.onopen = () => {
      attempt = 0;
      setStatus('open');
      armHeartbeat();
    };

    ws.onmessage = (message: MessageEvent<string>) => {
      armHeartbeat();
      const event = parseRealtimeEvent(
        typeof message.data === 'string' ? message.data : String(message.data),
      );
      if (event) onEvent?.(event);
    };

    ws.onerror = () => {
      ws.close();
    };

    ws.onclose = () => {
      if (heartbeatTimer) clearTimeout(heartbeatTimer);
      socket = null;
      if (stopped) {
        setStatus('closed');
        return;
      }
      scheduleReconnect();
    };
  }

  connect();

  return {
    getStatus: () => status,
    reconnect: () => {
      if (stopped) return;
      attempt = 0;
      clearTimers();
      socket?.close();
      if (!socket) connect();
    },
    close: () => {
      stopped = true;
      clearTimers();
      socket?.close();
      socket = null;
      setStatus('closed');
    },
  };
}
