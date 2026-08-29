import { CalendarClock } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookingCard, useMyBookings } from '@/entities/booking';
import { useOffices } from '@/entities/office';
import { CancelBookingDialog } from '@/features/cancel-booking';
import type { BookingScope, BookingView } from '@/shared/api';
import { Button, EmptyState, ErrorState, Select, Skeleton, Tabs } from '@/shared/ui';
import { HeadRow, Heading, List, OfficeFilter } from './BookingsPage.styles';

export function BookingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const scope: BookingScope = params.get('tab') === 'past' ? 'past' : 'upcoming';
  const officeId = params.get('office') ?? undefined;

  const patch = (key: string, value: string | null) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === null) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  };

  const officesQuery = useOffices();
  const upcomingQuery = useMyBookings('upcoming', officeId);
  const listQuery = useMyBookings(scope, officeId);

  const [cancelTarget, setCancelTarget] = useState<BookingView | null>(null);

  const officeOptions = [
    { value: '', label: t('bookings.allOffices') },
    ...(officesQuery.data ?? []).map((o) => ({ value: o.id, label: o.name })),
  ];

  return (
    <>
      <HeadRow>
        <Heading>{t('bookings.heading')}</Heading>
        <OfficeFilter>
          <Select
            options={officeOptions}
            value={officeId ?? ''}
            aria-label={t('bookings.allOffices')}
            fullWidth
            onChange={(e) => {
              patch('office', e.target.value || null);
            }}
          />
        </OfficeFilter>
      </HeadRow>

      <Tabs
        value={scope}
        onValueChange={(value) => {
          patch('tab', value === 'past' ? 'past' : null);
        }}
        aria-label={t('bookings.heading')}
        tabs={[
          {
            value: 'upcoming',
            label: t('bookings.tabUpcoming', { count: upcomingQuery.data?.length ?? 0 }),
          },
          { value: 'past', label: t('bookings.tabPast') },
        ]}
      >
        {listQuery.isPending ? (
          <List>
            {Array.from({ length: 2 }, (_, i) => (
              <Skeleton key={i} height={96} radius="var(--radius-lg)" />
            ))}
          </List>
        ) : listQuery.isError ? (
          <ErrorState
            description={t('bookings.errorText')}
            onRetry={() => void listQuery.refetch()}
          />
        ) : listQuery.data.length === 0 ? (
          <EmptyState
            icon={<CalendarClock size={40} strokeWidth={1.75} />}
            title={t('bookings.emptyTitle')}
            description={
              scope === 'upcoming' ? t('bookings.emptyUpcoming') : t('bookings.emptyPast')
            }
            action={
              scope === 'upcoming' ? (
                <Button onClick={() => void navigate('/rooms')}>{t('bookings.emptyCta')}</Button>
              ) : undefined
            }
          />
        ) : (
          <List>
            {listQuery.data.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                cancellable={scope === 'upcoming'}
                onCancel={setCancelTarget}
              />
            ))}
          </List>
        )}
      </Tabs>

      {cancelTarget && (
        <CancelBookingDialog
          booking={cancelTarget}
          onOpenChange={(open) => {
            if (!open) setCancelTarget(null);
          }}
        />
      )}
    </>
  );
}
