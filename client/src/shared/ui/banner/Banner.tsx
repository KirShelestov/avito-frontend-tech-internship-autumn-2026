import { Info } from 'lucide-react';
import type { ReactNode } from 'react';
import { BannerRoot, IconWrap, type BannerTone } from './Banner.styles';

export interface BannerProps {
  tone?: BannerTone;
  /** По умолчанию ⓘ, null убирает иконку */
  icon?: ReactNode;
  live?: 'polite' | 'assertive' | 'off';
  children: ReactNode;
  className?: string;
}

export function Banner({
  tone = 'warning',
  icon,
  live = 'polite',
  children,
  className,
}: BannerProps) {
  const resolvedIcon = icon === undefined ? <Info size={16} /> : icon;

  return (
    <BannerRoot $tone={tone} className={className} role="status" aria-live={live}>
      {resolvedIcon != null && <IconWrap aria-hidden="true">{resolvedIcon}</IconWrap>}
      <span>{children}</span>
    </BannerRoot>
  );
}
