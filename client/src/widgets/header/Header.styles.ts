import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';

export const Bar = styled.header`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--space-6);
  height: var(--header-height);
  padding: 0 var(--page-gutter);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);

  @media (max-width: 720px) {
    display: flex;
    flex-wrap: wrap;
    gap: 0 var(--space-4);
    height: auto;
    padding: var(--space-3) var(--space-4) 0;
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-xl);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-text);
  white-space: nowrap;
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
  align-self: stretch;
  gap: var(--space-8);

  @media (max-width: 720px) {
    order: 3;
    width: 100%;
    margin-top: var(--space-1);
  }
`;

export const NavItem = styled(NavLink)`
  position: relative;
  display: flex;
  align-items: center;
  font-size: var(--text-md);
  font-weight: 500;
  color: var(--color-text-secondary);
  white-space: nowrap;

  @media (max-width: 720px) {
    padding: var(--space-3) 0;
  }

  &:hover {
    color: var(--color-text);
  }

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
  justify-content: flex-end;
  gap: var(--space-3);
  font-size: var(--text-md);
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;

  @media (max-width: 720px) {
    margin-left: auto;
  }
`;

export const UserName = styled.span`
  @media (max-width: 480px) {
    display: none;
  }
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
