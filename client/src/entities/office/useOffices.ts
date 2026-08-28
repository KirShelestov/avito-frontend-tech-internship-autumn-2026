import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '@/shared/api';

export function useOffices() {
  return useQuery({
    queryKey: queryKeys.offices(),
    queryFn: ({ signal }) => api.listOffices(signal),
    staleTime: 5 * 60_000,
    select: (data) => data.items,
  });
}
