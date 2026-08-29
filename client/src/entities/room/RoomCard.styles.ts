import styled from '@emotion/styled';

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  padding: var(--space-5) var(--space-5) 18px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
`;

export const Name = styled.h3`
  font-size: var(--text-lg);
  font-weight: 700;
  line-height: 1.4;
  color: var(--color-text);
`;

export const Floor = styled.p`
  margin-top: var(--space-1);
  color: var(--color-text-muted);
  font-size: 13px;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 14px 0 var(--space-4);
`;

export const InfoRow = styled.p`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 20px;

  svg {
    flex-shrink: 0;
  }
`;

export const Footer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
  margin-top: var(--space-4);

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
`;
