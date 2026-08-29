import { createContext, useContext } from 'react';
import type { RealtimeStatus } from '@/shared/api';

export const RealtimeStatusContext = createContext<RealtimeStatus>('connecting');

export function useRealtimeStatus(): RealtimeStatus {
  return useContext(RealtimeStatusContext);
}
