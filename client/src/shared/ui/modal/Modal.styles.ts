import styled from '@emotion/styled';
import * as Dialog from '@radix-ui/react-dialog';

/** Не пробрасывать транзиентные ($) пропсы в DOM обёрнутых Radix-компонентов */
const transient = { shouldForwardProp: (prop: string) => !prop.startsWith('$') };

export const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
`;

export const Content = styled(Dialog.Content, transient)<{ $size: 'sm' | 'md' }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100vw - var(--space-8));
  max-width: ${(props) => (props.$size === 'sm' ? '480px' : '560px')};
  max-height: calc(100vh - var(--space-8));
  overflow-y: auto;
  background-color: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-pop);
  padding: var(--space-8);

  @media (max-width: 640px) {
    padding: var(--space-5);
  }

  &:focus {
    outline: none;
  }
`;

export const Header = styled.div`
  display: grid;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
`;

export const Divider = styled.hr`
  margin: var(--space-3) 0 0;
  border: none;
  border-top: 1px solid var(--color-border);
`;

export const Title = styled(Dialog.Title)`
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--color-text);
`;

export const Description = styled(Dialog.Description, transient)<{ $size: 'sm' | 'md' }>`
  font-size: ${(props) => (props.$size === 'sm' ? 'var(--text-base)' : 'var(--text-sm)')};
  color: var(--color-text-secondary);
`;

export const Body = styled.div`
  display: grid;
  gap: var(--space-5);
`;

export const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-5);

  @media (max-width: 640px) {
    & > * {
      flex: 1 1 auto;
    }
  }
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
