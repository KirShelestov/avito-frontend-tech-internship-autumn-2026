import * as RadixToast from '@radix-ui/react-toast';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Body, Close, Description, IconWrap, Root, Title, Viewport } from './Toast.styles';
import { ToastContext, type ToastOptions } from './toast-context';
import type { ToastTone } from './Toast.styles';

interface ToastEntry extends ToastOptions {
  id: string;
}

const icons: Record<ToastTone, ReactNode> = {
  success: <CheckCircle2 size={20} />,
  error: <XCircle size={20} />,
  info: <Info size={20} />,
};

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    counter += 1;
    const id = `toast-${String(counter)}`;
    setToasts((current) => [...current, { ...options, id }]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider swipeDirection="right">
        {children}
        {toasts.map((entry) => {
          const tone = entry.tone ?? 'info';
          return (
            <Root
              key={entry.id}
              $tone={tone}
              duration={entry.duration ?? 5000}
              onOpenChange={(open) => {
                if (!open) dismiss(entry.id);
              }}
            >
              <IconWrap $tone={tone} aria-hidden="true">
                {icons[tone]}
              </IconWrap>
              <Body>
                <Title>{entry.title}</Title>
                {entry.description != null && <Description>{entry.description}</Description>}
              </Body>
              <Close aria-label={t('actions.close')}>
                <X size={16} />
              </Close>
            </Root>
          );
        })}
        <Viewport />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}
