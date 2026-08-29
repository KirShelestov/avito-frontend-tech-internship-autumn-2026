import styled from '@emotion/styled';
import { invalidControl } from '../field/Field.styles';

export const Shell = styled.div<{ $fullWidth: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
`;

export const LeftIcon = styled.span`
  position: absolute;
  left: var(--control-padding);
  display: inline-flex;
  pointer-events: none;
  color: var(--color-text-secondary);
`;

export const StyledTimeInput = styled.input<{ $invalid: boolean; $fullWidth: boolean }>`
  width: ${(props) => (props.$fullWidth ? '100%' : '90px')};
  height: var(--control-height);
  padding: 0 6px 0 calc(var(--control-padding) + 28px);
  font-size: var(--control-font);
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &::placeholder {
    color: var(--color-text-subtle);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-50);
  }

  &:disabled {
    background-color: var(--color-bg);
    color: var(--color-text-subtle);
    cursor: not-allowed;
  }

  ${(props) => (props.$invalid ? invalidControl : '')}
`;
