import styled from '@emotion/styled';
import * as Dialog from '@radix-ui/react-dialog';

/** Не пробрасывать транзиентные ($) пропсы в DOM обёрнутых Radix-компонентов */
const transient = { shouldForwardProp: (prop: string) => !prop.startsWith('$') };

export const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background-color: rgba(16, 24, 40, 0.45);
  backdrop-filter: blur(1px);
`;

export const Content = styled(Dialog.Content, transient)<{ $size: 'sm' | 'md' }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100vw - var(--space-8));
  max-width: ${(props) => (props.$size === 'sm' ? '420px' : '560px')};
  max-height: calc(100vh - var(--space-8));
  overflow-y: auto;
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-pop);
  padding: var(--space-6);

  &:focus {
    outline: none;
  }
`;

export const Header = styled.div`
  display: grid;
  gap: var(--space-1);
  margin-bottom: var(--space-4);
`;

export const Title = styled(Dialog.Title)`
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
`;

export const Description = styled(Dialog.Description)`
  color: var(--color-text-muted);
`;

export const Body = styled.div`
  display: grid;
  gap: var(--space-4);
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
`;

export const CloseButton = styled(Dialog.Close)`
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);

  &:hover {
    background-color: var(--color-surface-muted);
  }
`;
