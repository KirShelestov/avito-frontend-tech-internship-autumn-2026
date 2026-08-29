import styled from '@emotion/styled';

export const Crumbs = styled.div`
  margin-bottom: var(--space-4);
`;

export const Columns = styled.div`
  display: grid;
  grid-template-columns: minmax(240px, 320px) 1fr;
  gap: var(--space-6);
  align-items: start;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.aside`
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: var(--space-6);
`;

export const RoomName = styled.h1`
  font-size: var(--text-xl);
  font-weight: 700;
`;

export const OfficeLine = styled.p`
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  margin: var(--space-1) 0 var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
`;

export const FeatureList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text);

  svg {
    flex-shrink: 0;
    color: var(--color-brand-600);
  }
`;
