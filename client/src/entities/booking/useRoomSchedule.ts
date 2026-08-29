import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '@/shared/api';
import { dayBoundsIso } from '@/shared/lib/datetime';

/** Сутки `dayIso` считаются в таймзоне офиса */
export function useRoomSchedule(roomId: string | undefined, dayIso: string, timezone: string) {
  return useQuery({
    queryKey: queryKeys.roomSchedule(roomId ?? '', dayIso),
    queryFn: ({ signal }) => {
      const { from, to } = dayBoundsIso(dayIso, timezone);
      return api.getRoomSchedule({ roomId: roomId!, from, to }, signal);
    },
    enabled: Boolean(roomId),
    select: (data) => data.items,
  });
}
