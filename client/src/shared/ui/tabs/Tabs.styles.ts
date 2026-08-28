import styled from '@emotion/styled';
import * as RadixTabs from '@radix-ui/react-tabs';

export const List = styled(RadixTabs.List)`
  display: flex;
  gap: var(--space-6);
  border-bottom: 1px solid var(--color-border);
`;

export const Trigger = styled(RadixTabs.Trigger)`
  position: relative;
  padding: var(--space-3) 0;
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;

  &[data-state='active'] {
    color: var(--color-brand-600);
  }

  &[data-state='active']::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background-color: var(--color-brand-600);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Content = styled(RadixTabs.Content)`
  padding-top: var(--space-6);

  &:focus-visible {
    outline: none;
  }
`;
