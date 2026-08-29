import { createContext, useContext } from 'react';
import type { RealtimeStatus } from '@/shared/api';

export interface RealtimeContextValue {
  status: RealtimeStatus;
  /** Соединение было установлено, потерялось и сейчас восстанавливается */
  isReconnecting: boolean;
}

export const RealtimeContext = createContext<RealtimeContextValue>({
  status: 'connecting',
  isReconnecting: false,
});

export function useRealtimeStatus(): RealtimeStatus {
  return useContext(RealtimeContext).status;
}

export function useIsReconnecting(): boolean {
  return useContext(RealtimeContext).isReconnecting;
}
