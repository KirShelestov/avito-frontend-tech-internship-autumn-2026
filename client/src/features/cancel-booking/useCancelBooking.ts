import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type BookingView } from '@/shared/api';

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, BookingView>({
    mutationFn: (booking) => api.cancelBooking(booking.id),
    onSuccess: (_data, booking) => {
      void queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      void queryClient.invalidateQueries({ queryKey: ['room-schedule', booking.roomId] });
      void queryClient.invalidateQueries({ queryKey: ['rooms', booking.office.id] });
    },
  });
}
