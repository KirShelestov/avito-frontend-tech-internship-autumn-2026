import type { ReactNode } from 'react';
import {
  IconCircle,
  StatusActions,
  StatusRoot,
  StatusText,
  StatusTitle,
  type StatusTone,
} from './Status.styles';

export interface StatusViewProps {
  icon: ReactNode;
  tone?: StatusTone;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function StatusView({
  icon,
  tone = 'neutral',
  title,
  description,
  action,
  className,
}: StatusViewProps) {
  return (
    <StatusRoot className={className}>
      <IconCircle $tone={tone} aria-hidden="true">
        {icon}
      </IconCircle>
      <StatusTitle>{title}</StatusTitle>
      {description != null && <StatusText>{description}</StatusText>}
      {action != null && <StatusActions>{action}</StatusActions>}
    </StatusRoot>
  );
}
