import { DoorClosed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { BookingView } from '@/shared/api';
import { dayCellParts, formatTimeInZone, zoneAbbr } from '@/shared/lib/datetime';
import { Button } from '@/shared/ui';
import { Body, Card, DateBox, Day, Meta, Month, Title } from './BookingCard.styles';

export interface BookingCardProps {
  booking: BookingView;
  /** Только для будущих броней */
  cancellable?: boolean;
  onCancel?: (booking: BookingView) => void;
}

export function BookingCard({ booking, cancellable = false, onCancel }: BookingCardProps) {
  const { t } = useTranslation();
  const zone = booking.office.timezone;
  const { month, day } = dayCellParts(booking.startsAt, zone);

  return (
    <Card aria-label={booking.title}>
      <DateBox aria-hidden="true">
        <Month>{month}</Month>
        <Day>{day}</Day>
      </DateBox>

      <Body>
        <Title>{booking.title}</Title>
        <Meta>
          <DoorClosed size={14} />
          <b>{booking.room.name}</b>
          {' · '}
          {t('bookings.meta', {
            floor: booking.room.floor,
            start: formatTimeInZone(booking.startsAt, zone),
            end: formatTimeInZone(booking.endsAt, zone),
            zone: zoneAbbr(zone),
          })}
        </Meta>
      </Body>

      {cancellable && (
        <Button variant="danger" size="sm" onClick={() => onCancel?.(booking)}>
          {t('bookings.cancel')}
        </Button>
      )}
    </Card>
  );
}
