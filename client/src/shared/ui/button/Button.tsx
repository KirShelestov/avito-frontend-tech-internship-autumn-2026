import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Spinner } from '../spinner';
import { SpinnerSlot, StyledButton } from './Button.styles';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leftIcon,
    disabled,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <StyledButton
      ref={ref}
      type={type}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={disabled ?? loading}
      aria-busy={loading}
      {...rest}
    >
      {leftIcon}
      {children}
      {loading && (
        <SpinnerSlot aria-hidden="true">
          <Spinner size={size === 'sm' ? 14 : 18} />
        </SpinnerSlot>
      )}
    </StyledButton>
  );
});
