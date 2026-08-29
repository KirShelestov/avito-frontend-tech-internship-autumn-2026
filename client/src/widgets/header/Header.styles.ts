import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';

export const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  height: var(--header-height);
  padding: 0 var(--space-6);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
`;

export const BrandMark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background-color: var(--color-brand-600);
  color: #fff;
`;

export const Nav = styled.nav`
  display: flex;
  gap: var(--space-6);
`;

export const NavItem = styled(NavLink)`
  position: relative;
  padding: calc((var(--header-height) - var(--text-md)) / 2 - 1px) 0;
  font-weight: 600;
  color: var(--color-text-muted);

  &.active {
    color: var(--color-brand-600);
  }

  &.active::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background-color: var(--color-brand-600);
  }
`;

export const UserBox = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-text);
`;

export const ConnectionDot = styled.span<{ $tone: 'ok' | 'wait' | 'off' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: ${(props) =>
    props.$tone === 'ok'
      ? 'var(--color-brand-500)'
      : props.$tone === 'wait'
        ? 'var(--color-warning-bg)'
        : 'var(--color-text-subtle)'};
`;
