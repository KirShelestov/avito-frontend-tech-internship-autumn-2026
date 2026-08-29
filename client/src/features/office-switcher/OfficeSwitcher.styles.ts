import styled from '@emotion/styled';

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
`;

export const SelectWrap = styled.div<{ $placeholder: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  width: fit-content;
  max-width: 100%;
  font-size: var(--text-lg);
  font-weight: 700;
  line-height: 1.4;
  color: ${(props) => (props.$placeholder ? 'var(--color-text-subtle)' : 'var(--color-text)')};

  svg {
    flex-shrink: 0;
  }

  &:focus-within {
    outline: 2px solid var(--color-brand-600);
    outline-offset: 4px;
    border-radius: var(--radius-sm);
  }

  @media (max-width: 640px) {
    font-size: var(--text-lg);
  }
`;

export const Label = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const NativeSelect = styled.select`
  position: absolute;
  inset: 0;
  width: 100%;
  opacity: 0;
  cursor: pointer;
  font-size: var(--text-md);
`;

export const Meta = styled.p`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  font-size: 13px;
  color: var(--color-text-muted);
`;

export const Dot = styled.span`
  color: var(--color-text-subtle);

  @media (max-width: 480px) {
    display: none;
  }
`;
