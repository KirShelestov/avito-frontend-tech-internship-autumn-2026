import { CalendarDays, DoorClosed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { BookingView } from '@/shared/api';
import { formatDateInZone, formatTimeInZone } from '@/shared/lib/datetime';
import { Button, Modal } from '@/shared/ui';
import { Summary, SummaryRow, SummaryTitle } from './CancelBookingDialog.styles';
import { useCancelBooking } from './useCancelBooking';

export interface CancelBookingDialogProps {
  booking: BookingView;
  onOpenChange: (open: boolean) => void;
}

export function CancelBookingDialog({ booking, onOpenChange }: CancelBookingDialogProps) {
  const { t } = useTranslation();
  const cancelBooking = useCancelBooking();

  const zone = booking.office.timezone;

  const confirm = () => {
    // Бронь исчезает сразу, тосты и откат обрабатывает useCancelBooking
    cancelBooking.mutate(booking);
    onOpenChange(false);
  };

  return (
    <Modal
      open
      onOpenChange={onOpenChange}
      size="sm"
      hideCloseButton
      title={t('cancelBooking.title')}
      description={t('cancelBooking.text')}
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t('cancelBooking.keep')}
          </Button>
          <Button variant="danger" onClick={confirm}>
            {t('cancelBooking.confirm')}
          </Button>
        </>
      }
    >
      <Summary>
        <SummaryTitle>{booking.title}</SummaryTitle>
        <SummaryRow>
          <DoorClosed size={14} />
          {t('cancelBooking.room', { room: booking.room.name, floor: booking.room.floor })}
        </SummaryRow>
        <SummaryRow>
          <CalendarDays size={14} />
          {t('cancelBooking.when', {
            date: formatDateInZone(booking.startsAt, zone),
            start: formatTimeInZone(booking.startsAt, zone),
            end: formatTimeInZone(booking.endsAt, zone),
          })}
        </SummaryRow>
      </Summary>
    </Modal>
  );
}
