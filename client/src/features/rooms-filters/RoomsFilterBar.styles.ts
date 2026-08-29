import styled from '@emotion/styled';

export const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  padding: var(--space-5) 0;
`;

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

export const GroupLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
  text-transform: uppercase;
  color: var(--color-text-subtle);
`;
