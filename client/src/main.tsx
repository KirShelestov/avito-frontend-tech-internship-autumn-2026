import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { env } from '@/shared/config/env';
import '@/shared/i18n';
import '@/app/styles/global.css';

async function enableMocking(): Promise<void> {
  if (!env.useMsw) return;
  const { mswWorker } = await import('@/shared/test/msw/browser');
  await mswWorker.start({ onUnhandledRequest: 'bypass' });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Не найден корневой элемент #root');
}

void enableMocking().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
