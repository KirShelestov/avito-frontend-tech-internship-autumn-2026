import { ws } from 'msw';
import { setupWorker } from 'msw/browser';
import { env } from '@/shared/config/env';
import { handlers } from './handlers';

// Без обработчика перехватчик MSW отдаёт фейковый open и сразу рвёт соединение,
// из-за чего в офлайн-режиме висел баннер «Соединение потеряно»
const realtime = ws.link(env.wsUrl);

export const mswWorker = setupWorker(
  ...handlers,
  realtime.addEventListener('connection', () => {}),
);
