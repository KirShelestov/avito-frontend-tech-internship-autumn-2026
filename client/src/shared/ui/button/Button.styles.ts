import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import type { ButtonSize, ButtonVariant } from './Button';

export interface ButtonStyleProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $loading: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    background-color: var(--color-brand-600);
    color: #fff;
    &:hover:not(:disabled):not([aria-disabled='true']) { background-color: var(--color-brand-700); }
    &:disabled, &[aria-disabled='true'] {
      background-color: var(--color-surface-muted);
      color: var(--color-text-subtle);
      opacity: 1;
    }
  `,
  secondary: `
    background-color: var(--color-surface);
    border-color: var(--color-border);
    color: var(--color-text-secondary);
    &:hover:not(:disabled):not([aria-disabled='true']) { background-color: var(--color-bg); }
  `,
  danger: `
    background-color: var(--color-danger-500);
    color: #fff;
    &:hover:not(:disabled):not([aria-disabled='true']) { background-color: var(--color-danger-600); }
  `,
  'danger-outline': `
    background-color: var(--color-surface);
    border-color: var(--color-danger-500);
    color: var(--color-danger-500);
    &:hover:not(:disabled):not([aria-disabled='true']) { background-color: var(--color-danger-100); }
  `,
  ghost: `
    background-color: transparent;
    color: var(--color-brand-600);
    &:hover:not(:disabled):not([aria-disabled='true']) { background-color: var(--color-brand-50); }
  `,
};

const buttonCss = (props: ButtonStyleProps): string => `
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  width: ${props.$fullWidth ? '100%' : 'auto'};
  height: ${props.$size === 'sm' ? '36px' : 'var(--control-height)'};
  padding: 0 ${props.$size === 'sm' ? 'var(--space-3)' : 'var(--space-5)'};
  font-size: var(--text-sm);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    opacity 0.15s ease;

  ${variantStyles[props.$variant]}

  &:disabled,
  &[aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${props.$loading ? 'cursor: progress; color: transparent;' : ''}
`;

const transient = { shouldForwardProp: (prop: string) => !prop.startsWith('$') };

export const StyledButton = styled('button', transient)<ButtonStyleProps>`
  ${buttonCss}
`;

export const StyledLinkButton = styled(Link, transient)<ButtonStyleProps>`
  ${buttonCss}
`;

export const SpinnerSlot = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
