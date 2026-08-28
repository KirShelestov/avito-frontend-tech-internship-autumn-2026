import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '@/shared/api';

export function useRoom(roomId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.room(roomId ?? ''),
    queryFn: ({ signal }) => api.getRoom(roomId!, signal),
    enabled: Boolean(roomId),
  });
}
