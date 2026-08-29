import styled from '@emotion/styled';

export const HeadRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin: 18px 0 var(--space-4);
`;

export const Heading = styled.h1`
  font-size: var(--text-3xl);
  font-weight: 700;
  line-height: 1.3;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: var(--space-2);
`;

export const HeadActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
`;

export const StateArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--header-height) - 300px);
`;
