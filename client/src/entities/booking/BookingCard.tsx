import { DoorOpen } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { BookingView } from '@/shared/api';
import { dayCellParts, formatTimeInZone, zoneAbbr } from '@/shared/lib/datetime';
import { Button } from '@/shared/ui';
import {
  Actions,
  Body,
  Card,
  DateBox,
  Day,
  Meta,
  Month,
  RoomName,
  Separator,
  Title,
} from './BookingCard.styles';

export interface BookingCardProps {
  booking: BookingView;
  /** Только для будущих броней */
  cancellable?: boolean;
  onCancel?: (booking: BookingView) => void;
  extraActions?: ReactNode;
}

export function BookingCard({
  booking,
  cancellable = false,
  onCancel,
  extraActions,
}: BookingCardProps) {
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
          <RoomName>
            <DoorOpen size={18} />
            {booking.room.name}
          </RoomName>
          <Separator aria-hidden="true">•</Separator>
          <span>{t('bookings.floor', { floor: booking.room.floor })}</span>
          <Separator aria-hidden="true">•</Separator>
          <span>
            {t('bookings.time', {
              start: formatTimeInZone(booking.startsAt, zone),
              end: formatTimeInZone(booking.endsAt, zone),
              zone: zoneAbbr(zone),
            })}
          </span>
        </Meta>
      </Body>

      <Actions>
        {extraActions}
        {cancellable && (
          <Button variant="danger-outline" onClick={() => onCancel?.(booking)}>
            {t('bookings.cancel')}
          </Button>
        )}
      </Actions>
    </Card>
  );
}
