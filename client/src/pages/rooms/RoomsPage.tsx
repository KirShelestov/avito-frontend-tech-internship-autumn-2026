import { Building2, SearchX } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOffices } from '@/entities/office';
import { roomOccupancy, useRoomSchedules } from '@/entities/booking';
import { RoomCard, useRooms } from '@/entities/room';
import { CreateBookingDialog } from '@/features/create-booking';
import { OfficeSwitcher } from '@/features/office-switcher';
import { RoomsFilterBar, useRoomsFilters } from '@/features/rooms-filters';
import type { RoomSummary } from '@/shared/api';
import { useDocumentTitle } from '@/shared/lib/useDocumentTitle';
import { formatTimeInZone } from '@/shared/lib/datetime';
import { Band, Button, Container, EmptyState, ErrorState, Skeleton } from '@/shared/ui';
import {
  Grid,
  Heading,
  OfficeBar,
  SkeletonButtons,
  SkeletonCard,
  StateArea,
} from './RoomsPage.styles';

function RoomsGridSkeleton() {
  return (
    <Grid aria-hidden="true">
      {Array.from({ length: 4 }, (_, i) => (
        <SkeletonCard key={i}>
          <Skeleton width="55%" height={22} />
          <Skeleton width="35%" height={14} />
          <Skeleton width="70%" height={14} />
          <Skeleton width="60%" height={14} />
          <Skeleton height={36} />
          <SkeletonButtons>
            <Skeleton height={38} />
            <Skeleton height={38} />
          </SkeletonButtons>
        </SkeletonCard>
      ))}
    </Grid>
  );
}

export function RoomsPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('nav.rooms'));
  const officesQuery = useOffices();
  const {
    filters,
    timezone,
    from,
    to,
    setOffice,
    setDate,
    setStart,
    setDuration,
    setCapacity,
    reset,
  } = useRoomsFilters(officesQuery.data);

  const [bookingRoom, setBookingRoom] = useState<RoomSummary | null>(null);

  const roomsQuery = useRooms({
    officeId: filters.officeId ?? undefined,
    minCapacity: filters.capacity ?? undefined,
    from,
    to,
  });

  const rooms = roomsQuery.data ?? [];
  const schedules = useRoomSchedules(
    rooms.map((room) => room.id),
    filters.date,
    timezone,
  );

  const occupancyLabel = (roomId: string): string | undefined => {
    const bookings = schedules.get(roomId);
    if (!bookings || !from) return undefined;
    const occupancy = roomOccupancy(bookings, from);
    switch (occupancy.kind) {
      case 'free-all-day':
        return t('room.freeAllDay');
      case 'free-rest-of-day':
        return t('room.freeRestOfDay');
      case 'busy-until':
        return t('room.busyUntil', { time: formatTimeInZone(occupancy.until, timezone) });
      case 'free-until':
        return t('room.freeUntil', { time: formatTimeInZone(occupancy.until, timezone) });
    }
  };

  const hasOffice = Boolean(filters.officeId);

  return (
    <>
      <Band>
        <Container>
          <OfficeBar>
            <OfficeSwitcher
              offices={officesQuery.data ?? []}
              selectedOfficeId={filters.officeId}
              onSelect={setOffice}
            />
          </OfficeBar>
        </Container>
      </Band>

      <Band>
        <Container>
          <RoomsFilterBar
            filters={filters}
            timezone={timezone}
            disabled={!hasOffice}
            onDateChange={setDate}
            onStartChange={setStart}
            onDurationChange={setDuration}
            onCapacityChange={setCapacity}
          />
        </Container>
      </Band>

      <Container>
        {officesQuery.isError ? (
          <StateArea>
            <ErrorState onRetry={() => void officesQuery.refetch()} />
          </StateArea>
        ) : !hasOffice ? (
          <StateArea>
            <EmptyState
              icon={<Building2 size={48} strokeWidth={1.5} />}
              title={t('rooms.pickOfficeTitle')}
              description={t('rooms.pickOfficeText')}
            />
          </StateArea>
        ) : roomsQuery.isPending ? (
          <>
            <Heading>{t('rooms.loading')}</Heading>
            <RoomsGridSkeleton />
          </>
        ) : roomsQuery.isError ? (
          <StateArea>
            <ErrorState
              description={t('rooms.errorText')}
              onRetry={() => void roomsQuery.refetch()}
            />
          </StateArea>
        ) : rooms.length === 0 ? (
          <StateArea>
            <EmptyState
              tone="muted"
              icon={<SearchX size={48} strokeWidth={1.75} />}
              title={t('rooms.emptyTitle')}
              description={t('rooms.emptyText')}
              action={<Button onClick={reset}>{t('actions.resetFilters')}</Button>}
            />
          </StateArea>
        ) : (
          <>
            <Heading>{t('rooms.heading')}</Heading>
            <Grid>
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  occupancyLabel={occupancyLabel(room.id)}
                  onBook={setBookingRoom}
                />
              ))}
            </Grid>
          </>
        )}
      </Container>

      {bookingRoom && (
        <CreateBookingDialog
          open
          room={bookingRoom}
          initialDate={filters.date}
          initialStart={filters.start}
          onOpenChange={(next) => {
            if (!next) setBookingRoom(null);
          }}
        />
      )}
    </>
  );
}
