import styled from '@emotion/styled';

export const Summary = styled.div`
  display: grid;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
  background-color: var(--color-bg);
`;

export const SummaryTitle = styled.p`
  margin-bottom: var(--space-1);
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-text);
`;

export const SummaryRow = styled.p`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);

  svg {
    flex-shrink: 0;
  }
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  width: 100%;
`;
