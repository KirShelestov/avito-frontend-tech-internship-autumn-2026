import styled from '@emotion/styled';

export const Summary = styled.div`
  display: grid;
  gap: var(--space-1);
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface-muted);
`;

export const SummaryTitle = styled.p`
  font-weight: 700;
  color: var(--color-text);
`;

export const SummaryRow = styled.p`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-muted);

  svg {
    flex-shrink: 0;
  }
`;
