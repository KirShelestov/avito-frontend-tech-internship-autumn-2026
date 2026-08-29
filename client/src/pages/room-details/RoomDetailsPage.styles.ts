import styled from '@emotion/styled';

export const Crumbs = styled.div`
  margin-bottom: var(--space-3);
`;

export const Columns = styled.div`
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: var(--space-8);
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 320px 1fr;
    gap: var(--space-6);
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.aside`
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  padding: var(--space-6);
`;

export const RoomName = styled.h1`
  font-size: var(--text-2xl);
  font-weight: 700;
  line-height: 1.3;
`;

export const OfficeLine = styled.p`
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  margin-top: var(--space-2);
  padding-bottom: var(--space-5);
  margin-bottom: var(--space-5);
  border-bottom: 1px solid var(--color-border);
`;

export const FeatureList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--text-sm);
  line-height: 20px;
  color: var(--color-text);

  svg {
    flex-shrink: 0;
    color: var(--color-brand-600);
  }
`;

export const SchedulePanel = styled.section`
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
`;
