import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type BookingView, type CreateBookingPayload } from '@/shared/api';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation<BookingView, Error, CreateBookingPayload>({
    mutationFn: (payload) => api.createBooking(payload),
    onSuccess: (booking) => {
      void queryClient.invalidateQueries({ queryKey: ['room-schedule', booking.roomId] });
      void queryClient.invalidateQueries({ queryKey: ['rooms', booking.office.id] });
      void queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
  });
}
