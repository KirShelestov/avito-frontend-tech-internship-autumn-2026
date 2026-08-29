import type { ReactNode } from 'react';
import type { StatusTone } from './Status.styles';
import { StatusView } from './StatusView';

export interface EmptyStateProps {
  icon: ReactNode;
  tone?: Exclude<StatusTone, 'danger'>;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  tone = 'neutral',
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <StatusView
      className={className}
      tone={tone}
      icon={icon}
      title={title}
      description={description}
      action={action}
    />
  );
}
