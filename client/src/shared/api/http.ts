import { env } from '@/shared/config/env';
import { HttpError, isApiErrorBody, NetworkError } from './errors';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
  /** undefined и null пропускаются */
  query?: Record<string, string | number | undefined | null>;
  signal?: AbortSignal;
  timeoutMs?: number;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(`${env.apiUrl}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/**
 * Обёртка над fetch: сериализация JSON, query, таймаут, разбор ошибок API.
 * Бросает `HttpError` на статус >= 400 и `NetworkError` при сбое соединения.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, signal, timeoutMs = 15_000 } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort(new DOMException('Timeout', 'TimeoutError'));
  }, timeoutMs);
  if (signal) {
    signal.addEventListener('abort', () => {
      controller.abort(signal.reason);
    });
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: body === undefined ? undefined : { 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === 'AbortError' || error.name === 'TimeoutError')
    ) {
      throw error;
    }
    throw new NetworkError();
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (isApiErrorBody(payload)) {
      throw new HttpError(
        response.status,
        payload.error.code,
        payload.error.message,
        payload.error.details,
      );
    }
    throw new HttpError(response.status, 'UNKNOWN', `Ошибка запроса (${String(response.status)})`);
  }

  return payload as T;
}
