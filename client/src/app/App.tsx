import { useTranslation } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { ErrorBoundary } from './providers/ErrorBoundary';
import { router } from './router';
import { ErrorState } from '@/shared/ui';

function GlobalErrorFallback({ reset }: { reset: () => void }) {
  const { t } = useTranslation();
  return (
    <ErrorState
      title={t('appError.title')}
      description={t('appError.description')}
      retryLabel={t('appError.reload')}
      onRetry={reset}
    />
  );
}

export function App() {
  return (
    <ErrorBoundary fallback={(reset) => <GlobalErrorFallback reset={reset} />}>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  );
}
