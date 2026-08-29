import styled from '@emotion/styled';

export const Heading = styled.h1`
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
  margin: var(--space-10) 0 var(--space-8);
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--space-6);
  padding-bottom: var(--space-10);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
`;

export const OfficeBar = styled.div`
  padding: var(--space-6) 0 22px;
`;

export const StateArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--header-height) - 200px);
`;

export const SkeletonButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
`;

export const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
`;
