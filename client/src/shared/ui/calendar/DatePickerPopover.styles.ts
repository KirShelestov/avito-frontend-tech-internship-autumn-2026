import styled from '@emotion/styled';
import * as Popover from '@radix-ui/react-popover';

const transient = { shouldForwardProp: (prop: string) => !prop.startsWith('$') };

export const Trigger = styled(Popover.Trigger, transient)<{ $invalid: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  height: 44px;
  padding: 0 var(--space-3);
  font-size: var(--text-md);
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid
    ${(props) => (props.$invalid ? 'var(--color-danger-600)' : 'var(--color-border)')};
  border-radius: var(--radius-md);
  cursor: pointer;

  svg {
    color: var(--color-text-muted);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px var(--color-brand-50);
  }
`;

export const Content = styled(Popover.Content)`
  z-index: 900;

  &:focus {
    outline: none;
  }
`;
