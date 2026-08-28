import { useTranslation } from 'react-i18next';
import { useRouteError } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { ErrorState } from '@/shared/ui';

export function RouteError() {
  const { t } = useTranslation();
  const error = useRouteError();
  console.error('Ошибка маршрута:', error);

  return (
    <>
      <Header />
      <ErrorState
        title={t('appError.title')}
        description={t('appError.description')}
        retryLabel={t('appError.reload')}
        onRetry={() => {
          window.location.reload();
        }}
      />
    </>
  );
}
