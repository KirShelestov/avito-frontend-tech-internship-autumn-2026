import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { RealtimeProvider } from '@/features/realtime';
import { createQueryClient } from '@/shared/lib/queryClient';
import { ToastProvider } from '@/shared/ui/toast';

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RealtimeProvider>{children}</RealtimeProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
