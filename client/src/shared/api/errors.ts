import type { ApiErrorBody } from './types';

/** Ошибка HTTP-запроса с разобранным телом `{ error: { code, message, details } }`. */
export class HttpError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: Record<string, unknown> | undefined;

  constructor(status: number, code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  get isConflict(): boolean {
    return this.status === 409 || this.code === 'BOOKING_CONFLICT';
  }
}

export function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (typeof value !== 'object' || value === null || !('error' in value)) {
    return false;
  }
  const { error } = value as Record<'error', unknown>;
  return typeof error === 'object' && error !== null && 'code' in error;
}

/** Ошибка сети/недоступности сервера (fetch reject, не HTTP-статус). */
export class NetworkError extends Error {
  constructor(message = 'Не удалось связаться с сервером') {
    super(message);
    this.name = 'NetworkError';
  }
}
