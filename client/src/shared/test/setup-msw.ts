import { afterAll, afterEach, beforeAll } from 'vitest';
import { resetDb } from './msw/db';
import { mswServer } from './msw/server';

/**
 * Вызывать на верхнем уровне describe или файла, а не в глобальном setup,
 * чтобы не конфликтовать с mock-socket в тестах WebSocket.
 */
export function setupMswServer(): void {
  beforeAll(() => {
    mswServer.listen({ onUnhandledRequest: 'bypass' });
  });

  afterEach(() => {
    mswServer.resetHandlers();
    resetDb();
  });

  afterAll(() => {
    mswServer.close();
  });
}
