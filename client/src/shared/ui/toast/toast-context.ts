import { createContext, useContext } from 'react';
import type { ToastTone } from './Toast.styles';

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** В миллисекундах */
  duration?: number;
}

export interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error('useToast должен использоваться внутри <ToastProvider>');
  }
  return value;
}
