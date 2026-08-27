import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../button';
import { StatusView } from './StatusView';

export interface ErrorStateProps {
  title?: ReactNode;
  description?: ReactNode;
  /** Без обработчика кнопка «Попробовать снова» не показывается */
  onRetry?: () => void;
  retryLabel?: ReactNode;
  className?: string;
}

export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel,
  className,
}: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <StatusView
      className={className}
      tone="danger"
      icon={<AlertTriangle size={40} strokeWidth={2} />}
      title={title ?? t('states.loadError')}
      description={description}
      action={
        onRetry ? (
          <Button variant="primary" onClick={onRetry}>
            {retryLabel ?? t('actions.retry')}
          </Button>
        ) : undefined
      }
    />
  );
}
