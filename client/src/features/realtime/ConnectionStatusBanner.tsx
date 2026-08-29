import { useTranslation } from 'react-i18next';
import { Banner } from '@/shared/ui';
import { useIsReconnecting } from './realtime-context';

export function ConnectionStatusBanner() {
  const { t } = useTranslation();
  const isReconnecting = useIsReconnecting();

  if (!isReconnecting) return null;

  return (
    <Banner tone="warning" live="assertive">
      {t('realtime.reconnecting')}
    </Banner>
  );
}
