import styled from '@emotion/styled';

export const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  padding: var(--space-4) 0 var(--space-5);
  border-bottom: 1px solid var(--color-border);
`;

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
`;

export const GroupLabel = styled.span`
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
`;
