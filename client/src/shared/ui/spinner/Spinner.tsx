import { useTranslation } from 'react-i18next';
import { Circle } from './Spinner.styles';

export interface SpinnerProps {
  size?: number;
  thickness?: number;
  label?: string;
  className?: string;
}

export function Spinner({ size = 20, thickness = 2, label, className }: SpinnerProps) {
  const { t } = useTranslation();
  return (
    <Circle
      className={className}
      $size={size}
      $thickness={thickness}
      role="status"
      aria-label={label ?? t('states.loading')}
    />
  );
}
