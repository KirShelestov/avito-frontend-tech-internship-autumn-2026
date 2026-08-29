import styled from '@emotion/styled';
import * as Popover from '@radix-ui/react-popover';
import { invalidControl } from '../field/Field.styles';

const transient = { shouldForwardProp: (prop: string) => !prop.startsWith('$') };

export const Trigger = styled(Popover.Trigger, transient)<{
  $invalid: boolean;
  $fullWidth: boolean;
}>`
  display: inline-flex;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  height: var(--control-height);
  padding: 0 var(--control-padding);
  white-space: nowrap;
  font-size: var(--control-font);
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;

  svg {
    flex-shrink: 0;
    color: var(--color-text-secondary);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-50);
  }

  &:disabled {
    background-color: var(--color-bg);
    color: var(--color-text-subtle);
    cursor: not-allowed;

    svg {
      color: var(--color-text-subtle);
    }
  }

  ${(props) => (props.$invalid ? invalidControl : '')}
`;

export const Content = styled(Popover.Content)`
  z-index: 900;

  &:focus {
    outline: none;
  }
`;
