import styled from '@emotion/styled';

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
`;

export const Name = styled.h3`
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
`;

export const Floor = styled.p`
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  margin-top: calc(-1 * var(--space-2));
`;

export const InfoRow = styled.p`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--text-sm);

  svg {
    flex-shrink: 0;
    color: var(--color-brand-600);
  }
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-top: var(--space-1);
`;
