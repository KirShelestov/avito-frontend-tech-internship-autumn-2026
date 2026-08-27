import type { ReactNode } from 'react';
import { BadgeRoot, Dot, type BadgeTone } from './Badge.styles';

export interface BadgeProps {
  tone?: BadgeTone;
  dot?: boolean;
  block?: boolean;
  children: ReactNode;
  className?: string;
}

export function Badge({
  tone = 'neutral',
  dot = false,
  block = false,
  children,
  className,
}: BadgeProps) {
  return (
    <BadgeRoot $tone={tone} $block={block} className={className}>
      {dot && <Dot aria-hidden="true" />}
      {children}
    </BadgeRoot>
  );
}
