import styled from '@emotion/styled';

export const Nav = styled.nav`
  font-size: var(--text-sm);
`;

export const List = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const Item = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text-muted);
`;

export const Separator = styled.span`
  display: inline-flex;
  color: var(--color-text-subtle);
`;

export const Current = styled.span`
  color: var(--color-text);
  font-weight: 600;
`;
