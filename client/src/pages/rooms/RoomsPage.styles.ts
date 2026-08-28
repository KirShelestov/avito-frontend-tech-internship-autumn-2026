import styled from '@emotion/styled';

export const TopBar = styled.div`
  padding-bottom: var(--space-2);
`;

export const Heading = styled.h1`
  font-size: var(--text-xl);
  font-weight: 700;
  margin: var(--space-6) 0 var(--space-4);
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
`;

export const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
`;
