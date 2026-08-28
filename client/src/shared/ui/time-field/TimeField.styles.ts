import styled from '@emotion/styled';

export const Shell = styled.div<{ $fullWidth: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
`;

export const LeftIcon = styled.span`
  position: absolute;
  left: var(--space-3);
  display: inline-flex;
  pointer-events: none;
  color: var(--color-text-muted);
`;

export const StyledTimeInput = styled.input<{ $invalid: boolean }>`
  width: 100%;
  height: 44px;
  padding: 0 var(--space-3) 0 calc(var(--space-6) + var(--space-2));
  font-size: var(--text-md);
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid
    ${(props) => (props.$invalid ? 'var(--color-danger-600)' : 'var(--color-border)')};
  border-radius: var(--radius-md);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &::placeholder {
    color: var(--color-text-subtle);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px var(--color-brand-50);
  }

  &:disabled {
    background-color: var(--color-surface-muted);
    cursor: not-allowed;
  }
`;
