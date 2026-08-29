import { Building2, SearchX } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOffices } from '@/entities/office';
import { RoomCard, useRooms } from '@/entities/room';
import { CreateBookingDialog } from '@/features/create-booking';
import { OfficeSwitcher } from '@/features/office-switcher';
import { RoomsFilterBar, useRoomsFilters } from '@/features/rooms-filters';
import type { RoomSummary } from '@/shared/api';
import { Button, EmptyState, ErrorState, Skeleton } from '@/shared/ui';
import { Grid, Heading, SkeletonCard, TopBar } from './RoomsPage.styles';

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
          <Skeleton width="45%" height={32} />
        </SkeletonCard>
      ))}
    </Grid>
  );
}

export function RoomsPage() {
  const { t } = useTranslation();
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

  if (officesQuery.isError) {
    return <ErrorState onRetry={() => void officesQuery.refetch()} />;
  }

  const hasOffice = Boolean(filters.officeId);

  return (
    <>
      <TopBar>
        <OfficeSwitcher
          offices={officesQuery.data ?? []}
          selectedOfficeId={filters.officeId}
          onSelect={setOffice}
        />
      </TopBar>

      <RoomsFilterBar
        filters={filters}
        timezone={timezone}
        disabled={!hasOffice}
        onDateChange={setDate}
        onStartChange={setStart}
        onDurationChange={setDuration}
        onCapacityChange={setCapacity}
      />

      {!hasOffice ? (
        <EmptyState
          icon={<Building2 size={40} strokeWidth={1.75} />}
          title={t('rooms.pickOfficeTitle')}
          description={t('rooms.pickOfficeText')}
        />
      ) : roomsQuery.isPending ? (
        <>
          <Heading>{t('rooms.loading')}</Heading>
          <RoomsGridSkeleton />
        </>
      ) : roomsQuery.isError ? (
        <ErrorState description={t('rooms.errorText')} onRetry={() => void roomsQuery.refetch()} />
      ) : roomsQuery.data.length === 0 ? (
        <EmptyState
          icon={<SearchX size={40} strokeWidth={1.75} />}
          title={t('rooms.emptyTitle')}
          description={t('rooms.emptyText')}
          action={<Button onClick={reset}>{t('actions.resetFilters')}</Button>}
        />
      ) : (
        <>
          <Heading>{t('rooms.heading')}</Heading>
          <Grid>
            {roomsQuery.data.map((room) => (
              <RoomCard key={room.id} room={room} onBook={setBookingRoom} />
            ))}
          </Grid>
        </>
      )}

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
