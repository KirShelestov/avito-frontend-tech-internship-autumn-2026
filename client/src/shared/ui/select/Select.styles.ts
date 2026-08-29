import styled from '@emotion/styled';

export const SelectShell = styled.div<{
  $fullWidth: boolean;
  $invalid: boolean;
  $disabled: boolean;
}>`
  position: relative;
  display: ${(props) => (props.$fullWidth ? 'flex' : 'inline-flex')};
  align-items: center;
  gap: 10px;
  width: ${(props) => (props.$fullWidth ? '100%' : 'fit-content')};
  height: var(--control-height);
  padding: 0 var(--space-3) 0 var(--control-padding);
  font-size: var(--control-font);
  color: ${(props) => (props.$disabled ? 'var(--color-text-subtle)' : 'var(--color-text)')};
  background-color: ${(props) => (props.$disabled ? 'var(--color-bg)' : 'var(--color-surface)')};
  border: 1px solid
    ${(props) => (props.$invalid ? 'var(--color-danger-500)' : 'var(--color-border)')};
  border-radius: var(--radius-md);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus-within {
    border-color: ${(props) =>
      props.$invalid ? 'var(--color-danger-500)' : 'var(--color-brand-600)'};
    box-shadow: 0 0 0 3px
      ${(props) => (props.$invalid ? 'var(--color-danger-100)' : 'var(--color-brand-50)')};
  }

  svg {
    flex-shrink: 0;
    color: ${(props) =>
      props.$disabled ? 'var(--color-text-subtle)' : 'var(--color-text-secondary)'};
  }
`;

export const Value = styled.span<{ $placeholder: boolean }>`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${(props) => (props.$placeholder ? 'color: var(--color-text-subtle);' : '')}
`;

/** Нативный select прозрачно лежит поверх: клавиатура, скринридеры и выпадашка остаются родными */
export const NativeSelect = styled.select`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  font-size: var(--text-md);

  &:disabled {
    cursor: not-allowed;
  }
`;
