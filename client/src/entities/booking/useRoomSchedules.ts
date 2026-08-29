import { useQueries } from '@tanstack/react-query';
import { api, queryKeys, type BookingView } from '@/shared/api';
import { dayBoundsIso } from '@/shared/lib/datetime';

/** Расписания нескольких комнат за день; ключи общие с useRoomSchedule */
export function useRoomSchedules(
  roomIds: string[],
  dayIso: string,
  timezone: string,
): Map<string, BookingView[]> {
  return useQueries({
    queries: roomIds.map((roomId) => ({
      queryKey: queryKeys.roomSchedule(roomId, dayIso),
      queryFn: ({ signal }: { signal: AbortSignal }) => {
        const { from, to } = dayBoundsIso(dayIso, timezone);
        return api.getRoomSchedule({ roomId, from, to }, signal);
      },
    })),
    combine: (results) => {
      const byRoom = new Map<string, BookingView[]>();
      results.forEach((result, index) => {
        if (result.data) byRoom.set(roomIds[index]!, result.data.items);
      });
      return byRoom;
    },
  });
}
