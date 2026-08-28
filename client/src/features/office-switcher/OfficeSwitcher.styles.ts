import styled from '@emotion/styled';

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
`;

export const SelectWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: fit-content;

  svg {
    position: absolute;
    right: 0;
    pointer-events: none;
    color: var(--color-text-muted);
  }
`;

export const NativeSelect = styled.select<{ $placeholder: boolean }>`
  appearance: none;
  padding: 0 calc(var(--space-6)) 0 0;
  font-size: var(--text-xl);
  font-weight: 700;
  color: ${(props) => (props.$placeholder ? 'var(--color-text-subtle)' : 'var(--color-text)')};
  background: transparent;
  border: none;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--color-brand-600);
    outline-offset: 4px;
    border-radius: var(--radius-sm);
  }
`;

export const Meta = styled.p`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
`;

export const Dot = styled.span`
  color: var(--color-text-subtle);
`;
