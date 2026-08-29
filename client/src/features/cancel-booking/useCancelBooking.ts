import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api, type BookingView, type ItemsResponse } from '@/shared/api';
import { useToast } from '@/shared/ui';

type BookingsCache = ItemsResponse<BookingView> | undefined;

interface CancelContext {
  snapshots: [QueryKey, BookingsCache][];
}

const withoutBooking = (cache: BookingsCache, id: string): BookingsCache =>
  cache ? { ...cache, items: cache.items.filter((booking) => booking.id !== id) } : cache;

/**
 * Оптимистичная отмена: бронь сразу исчезает из «моих броней» и расписания
 * комнаты, при ошибке снапшоты откатываются и показывается тост.
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation<void, Error, BookingView, CancelContext>({
    mutationFn: (booking) => api.cancelBooking(booking.id),

    onMutate: async (booking) => {
      const scopes: QueryKey[] = [['my-bookings'], ['room-schedule', booking.roomId]];
      await Promise.all(scopes.map((queryKey) => queryClient.cancelQueries({ queryKey })));

      const snapshots = scopes.flatMap((queryKey) =>
        queryClient.getQueriesData<ItemsResponse<BookingView>>({ queryKey }),
      );

      for (const queryKey of scopes) {
        queryClient.setQueriesData<ItemsResponse<BookingView>>({ queryKey }, (cache) =>
          withoutBooking(cache, booking.id),
        );
      }

      return { snapshots };
    },

    onError: (_error, _booking, context) => {
      for (const [queryKey, data] of context?.snapshots ?? []) {
        queryClient.setQueryData(queryKey, data);
      }
      toast({ tone: 'error', title: t('bookings.cancelErrorToast') });
    },

    onSuccess: () => {
      toast({ tone: 'success', title: t('bookings.cancelledToast') });
    },

    onSettled: (_data, _error, booking) => {
      void queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      void queryClient.invalidateQueries({ queryKey: ['room-schedule', booking.roomId] });
      void queryClient.invalidateQueries({ queryKey: ['rooms', booking.office.id] });
    },
  });
}
