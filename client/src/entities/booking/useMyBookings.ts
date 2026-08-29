import { useQuery } from '@tanstack/react-query';
import { api, queryKeys, type BookingScope } from '@/shared/api';

export function useMyBookings(scope: BookingScope, officeId?: string) {
  return useQuery({
    queryKey: queryKeys.myBookings(scope, officeId),
    queryFn: ({ signal }) => api.listBookings({ scope, officeId }, signal),
    select: (data) => data.items,
  });
}
