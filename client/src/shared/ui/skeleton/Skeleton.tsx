import { Box } from './Skeleton.styles';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  circle?: boolean;
  className?: string;
}

const toCss = (value: number | string): string =>
  typeof value === 'number' ? `${value}px` : value;

export function Skeleton({
  width = '100%',
  height = 16,
  radius = 'var(--radius-sm)',
  circle = false,
  className,
}: SkeletonProps) {
  return (
    <Box
      className={className}
      aria-hidden="true"
      $width={toCss(width)}
      $height={toCss(height)}
      $radius={toCss(radius)}
      $circle={circle}
    />
  );
}
