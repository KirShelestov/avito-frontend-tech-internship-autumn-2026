import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '@/shared/api';

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: ({ signal }) => api.getMe(signal),
    staleTime: Infinity,
  });
}
