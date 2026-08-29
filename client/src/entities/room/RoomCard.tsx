import { Clock, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { RoomSummary } from '@/shared/api';
import { Badge, Button, LinkButton } from '@/shared/ui';
import { Card, Floor, Footer, Info, InfoRow, Name } from './RoomCard.styles';

export interface RoomCardProps {
  room: RoomSummary;
  /** Например, «Занята до 15:30» */
  occupancyLabel?: ReactNode;
  onBook: (room: RoomSummary) => void;
}

export function RoomCard({ room, occupancyLabel, onBook }: RoomCardProps) {
  const { t } = useTranslation();
  const hasSlot = room.available !== undefined;
  const available = room.available === true;

  return (
    <Card aria-label={room.name}>
      <Name>{room.name}</Name>
      <Floor>{t('room.floor', { floor: room.floor })}</Floor>

      <Info>
        <InfoRow>
          <Users size={18} />
          {t('room.capacity', { count: room.capacity })}
        </InfoRow>
        {occupancyLabel != null && (
          <InfoRow>
            <Clock size={18} />
            {occupancyLabel}
          </InfoRow>
        )}
      </Info>

      {hasSlot && (
        <Badge tone={available ? 'available' : 'busy'} dot block>
          {available ? t('room.availableForSlot') : t('room.unavailableForSlot')}
        </Badge>
      )}

      <Footer>
        <LinkButton to={`/rooms/${room.id}`} variant="ghost" fullWidth>
          {t('actions.details')}
        </LinkButton>
        <Button fullWidth disabled={hasSlot && !available} onClick={() => onBook(room)}>
          {t('actions.book')}
        </Button>
      </Footer>
    </Card>
  );
}
