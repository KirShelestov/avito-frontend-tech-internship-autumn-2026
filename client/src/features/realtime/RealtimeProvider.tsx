import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { createRealtimeClient, type RealtimeEvent, type RealtimeStatus } from '@/shared/api';
import { env } from '@/shared/config/env';
import { useMe } from '@/entities/user';
import { useToast } from '@/shared/ui';
import { invalidationsForEvent } from './event-invalidation';
import { RealtimeContext } from './realtime-context';

export interface RealtimeProviderProps {
  children: ReactNode;
  disabled?: boolean;
  url?: string;
  webSocketImpl?: new (url: string) => WebSocket;
}

const FLUSH_DELAY_MS = 150;

export function RealtimeProvider({
  children,
  disabled = false,
  url,
  webSocketImpl,
}: RealtimeProviderProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: me } = useMe();

  const [status, setStatus] = useState<RealtimeStatus>(disabled ? 'closed' : 'connecting');
  const [everConnected, setEverConnected] = useState(false);

  const meId = me?.id;
  const pending = useRef(new Map<string, string[]>());
  const flushTimer = useRef<ReturnType<typeof setTimeout>>();
  const everConnectedRef = useRef(false);

  useEffect(() => {
    if (disabled) return;

    const flush = () => {
      flushTimer.current = undefined;
      for (const key of pending.current.values()) {
        void queryClient.invalidateQueries({ queryKey: key, refetchType: 'active' });
      }
      pending.current.clear();
    };

    const handleEvent = (event: RealtimeEvent) => {
      if (event.type === 'data.reset') {
        queryClient.clear();
        void queryClient.refetchQueries({ type: 'active' });
        toast({ tone: 'info', title: t('realtime.dataReset') });
        return;
      }
      for (const key of invalidationsForEvent(event, meId)) {
        pending.current.set(key.join('|'), key);
      }
      if (!flushTimer.current) {
        flushTimer.current = setTimeout(flush, FLUSH_DELAY_MS);
      }
    };

    const handleStatus = (next: RealtimeStatus) => {
      setStatus(next);
      if (next === 'open') {
        if (everConnectedRef.current) {
          // Журнала пропущенных событий нет, поэтому после разрыва перечитываем всё
          void queryClient.invalidateQueries({ refetchType: 'active' });
        }
        everConnectedRef.current = true;
        setEverConnected(true);
      }
    };

    const client = createRealtimeClient({
      url: url ?? env.wsUrl,
      onEvent: handleEvent,
      onStatusChange: handleStatus,
      ...(webSocketImpl ? { WebSocketImpl: webSocketImpl } : {}),
    });

    return () => {
      if (flushTimer.current) clearTimeout(flushTimer.current);
      client.close();
    };
  }, [disabled, url, webSocketImpl, queryClient, toast, t, meId]);

  const value = useMemo(
    () => ({ status, isReconnecting: everConnected && status !== 'open' }),
    [status, everConnected],
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}
