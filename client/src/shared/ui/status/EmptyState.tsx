import type { ReactNode } from 'react';
import { StatusView } from './StatusView';

export interface EmptyStateProps {
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <StatusView
      className={className}
      tone="neutral"
      icon={icon}
      title={title}
      description={description}
      action={action}
    />
  );
}
