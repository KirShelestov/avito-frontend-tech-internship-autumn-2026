import styled from '@emotion/styled';

export const SelectShell = styled.div<{ $fullWidth: boolean; $invalid: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};

  svg {
    position: absolute;
    right: var(--space-3);
    pointer-events: none;
    color: var(--color-text-muted);
  }
`;

export const NativeSelect = styled.select<{ $invalid: boolean; $hasLeftIcon: boolean }>`
  appearance: none;
  width: 100%;
  height: 44px;
  padding: 0 calc(var(--space-6) + var(--space-2)) 0
    ${(props) => (props.$hasLeftIcon ? 'calc(var(--space-6) + var(--space-2))' : 'var(--space-3)')};
  font-size: var(--text-md);
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid
    ${(props) => (props.$invalid ? 'var(--color-danger-600)' : 'var(--color-border)')};
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

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

export const LeftIcon = styled.span`
  position: absolute;
  left: var(--space-3);
  display: inline-flex;
  pointer-events: none;
  color: var(--color-text-muted);
`;
