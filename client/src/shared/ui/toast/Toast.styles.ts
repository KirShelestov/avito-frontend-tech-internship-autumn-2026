import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import * as Toast from '@radix-ui/react-toast';

const transient = { shouldForwardProp: (prop: string) => !prop.startsWith('$') };

export type ToastTone = 'success' | 'error' | 'info';

const slideIn = keyframes`
  from { transform: translateX(calc(100% + var(--space-6))); }
  to { transform: translateX(0); }
`;

export const Viewport = styled(Toast.Viewport)`
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 380px;
  max-width: calc(100vw - var(--space-8));
  margin: 0;
  padding: 0;
  list-style: none;
  z-index: 1000;
  outline: none;
`;

const toneAccent: Record<ToastTone, string> = {
  success: 'var(--color-brand-600)',
  error: 'var(--color-danger-600)',
  info: 'var(--color-text-muted)',
};

export const Root = styled(Toast.Root, transient)<{ $tone: ToastTone }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-3);
  align-items: start;
  padding: var(--space-4);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 3px solid ${(props) => toneAccent[props.$tone]};
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-pop);

  &[data-state='open'] {
    animation: ${slideIn} 0.18s ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    &[data-state='open'] {
      animation: none;
    }
  }
`;

export const IconWrap = styled.span<{ $tone: ToastTone }>`
  display: inline-flex;
  color: ${(props) => toneAccent[props.$tone]};
`;

export const Body = styled.div`
  display: grid;
  gap: 2px;
  min-width: 0;
`;

export const Title = styled(Toast.Title)`
  font-weight: 700;
  color: var(--color-text);
`;

export const Description = styled(Toast.Description)`
  font-size: var(--text-sm);
  color: var(--color-text-muted);
`;

export const Close = styled(Toast.Close)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  color: var(--color-text-subtle);

  &:hover {
    background-color: var(--color-surface-muted);
  }
`;
