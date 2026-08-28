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
  `,
  secondary: `
    background-color: var(--color-surface);
    border-color: var(--color-border);
    color: var(--color-text);
    &:hover:not(:disabled):not([aria-disabled='true']) { background-color: var(--color-surface-muted); }
  `,
  danger: `
    background-color: var(--color-danger-600);
    color: #fff;
    &:hover:not(:disabled):not([aria-disabled='true']) { background-color: var(--color-danger-500); }
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
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  width: ${props.$fullWidth ? '100%' : 'auto'};
  padding: ${props.$size === 'sm' ? '8px 14px' : '12px 20px'};
  font-size: ${props.$size === 'sm' ? 'var(--text-sm)' : 'var(--text-md)'};
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
