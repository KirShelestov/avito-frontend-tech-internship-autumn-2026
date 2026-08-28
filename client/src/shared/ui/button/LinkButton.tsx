import type { LinkProps } from 'react-router-dom';
import type { ButtonSize, ButtonVariant } from './Button';
import { StyledLinkButton } from './Button.styles';

export interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export function LinkButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...rest
}: LinkButtonProps) {
  return (
    <StyledLinkButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={false}
      {...rest}
    />
  );
}
