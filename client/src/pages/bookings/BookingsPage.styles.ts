import styled from '@emotion/styled';

export const HeadRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
`;

export const Heading = styled.h1`
  font-size: var(--text-2xl);
  font-weight: 800;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-6);
`;

export const HeadActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
`;

export const OfficeFilter = styled.div`
  min-width: 200px;
`;
