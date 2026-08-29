import styled from '@emotion/styled';

export const FieldRoot = styled.div<{ $fullWidth: boolean }>`
  display: inline-flex;
  flex-direction: column;
  gap: var(--space-2);
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
`;

export const FieldLabel = styled.label`
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
`;

export const RequiredMark = styled.span`
  margin-left: 4px;
`;

export const FieldHint = styled.span`
  font-size: var(--text-xs);
  color: var(--color-text-muted);
`;

export const FieldError = styled.span`
  margin-top: calc(-1 * var(--space-1));
  font-size: var(--text-xs);
  color: var(--color-danger-500);
`;

export const invalidControl = `
  border-color: var(--color-danger-500);

  &:focus-visible {
    border-color: var(--color-danger-500);
    box-shadow: 0 0 0 3px var(--color-danger-100);
  }
`;

const controlBase = `
  width: 100%;
  font-size: var(--control-font);
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
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-50);
  }

  &:disabled {
    background-color: var(--color-bg);
    color: var(--color-text-subtle);
    cursor: not-allowed;
  }
`;

export const StyledInput = styled.input<{ $invalid: boolean }>`
  ${controlBase}
  height: var(--control-height);
  padding: 0 var(--control-padding);
  ${(props) => (props.$invalid ? invalidControl : '')}
`;

export const StyledTextarea = styled.textarea<{ $invalid: boolean }>`
  ${controlBase}
  min-height: 80px;
  padding: var(--space-3) var(--control-padding);
  resize: none;
  font-family: inherit;
  ${(props) => (props.$invalid ? invalidControl : '')}
`;
