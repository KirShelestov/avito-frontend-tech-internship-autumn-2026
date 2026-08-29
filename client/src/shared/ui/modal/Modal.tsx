import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Body,
  CloseButton,
  Content,
  Description,
  Divider,
  Footer,
  Header,
  Overlay,
  Title,
} from './Modal.styles';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md';
  hideCloseButton?: boolean;
  headerDivider?: boolean;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  hideCloseButton = false,
  headerDivider = false,
}: ModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Content $size={size} {...(description == null ? { 'aria-describedby': undefined } : {})}>
          <Header>
            <Title>{title}</Title>
            {description != null && <Description $size={size}>{description}</Description>}
            {headerDivider && <Divider />}
          </Header>

          {children != null && <Body>{children}</Body>}
          {footer != null && <Footer>{footer}</Footer>}

          {!hideCloseButton && (
            <CloseButton aria-label={t('actions.close')}>
              <X size={18} />
            </CloseButton>
          )}
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
