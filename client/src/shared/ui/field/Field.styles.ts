import styled from '@emotion/styled';

export const FieldRoot = styled.div<{ $fullWidth: boolean }>`
  display: inline-flex;
  flex-direction: column;
  gap: var(--space-1);
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
`;

export const FieldLabel = styled.label`
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
`;

export const RequiredMark = styled.span`
  color: var(--color-danger-600);
  margin-left: 2px;
`;

export const FieldHint = styled.span`
  font-size: var(--text-xs);
  color: var(--color-text-muted);
`;

export const FieldError = styled.span`
  font-size: var(--text-xs);
  color: var(--color-danger-600);
`;

const controlBase = `
  width: 100%;
  font-size: var(--text-md);
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

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

export const StyledInput = styled.input<{ $invalid: boolean }>`
  ${controlBase}
  height: 44px;
  padding: 0 var(--space-3);
  ${(props) => props.$invalid && 'border-color: var(--color-danger-600);'}
`;

export const StyledTextarea = styled.textarea<{ $invalid: boolean }>`
  ${controlBase}
  min-height: 96px;
  padding: var(--space-3);
  resize: vertical;
  font-family: inherit;
  ${(props) => props.$invalid && 'border-color: var(--color-danger-600);'}
`;
