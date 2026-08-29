import { Calendar, CalendarClock } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookingCard, useMyBookings } from '@/entities/booking';
import { useOffices } from '@/entities/office';
import { CancelBookingDialog } from '@/features/cancel-booking';
import { ExportIcsButton } from '@/features/ics-export';
import type { BookingScope, BookingView } from '@/shared/api';
import { useDocumentTitle } from '@/shared/lib/useDocumentTitle';
import { Button, EmptyState, ErrorState, PageBody, Select, Skeleton, Tabs } from '@/shared/ui';
import { HeadActions, HeadRow, Heading, List, StateArea } from './BookingsPage.styles';
import { filterByPeriod, isBookingPeriod, type BookingPeriod } from './period';

export function BookingsPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('bookings.heading'));
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const scope: BookingScope = params.get('tab') === 'past' ? 'past' : 'upcoming';
  const officeId = params.get('office') ?? undefined;
  const periodParam = params.get('period');
  const period: BookingPeriod = isBookingPeriod(periodParam) ? periodParam : 'all';

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

  const upcoming = filterByPeriod(upcomingQuery.data, period, 'upcoming');
  const bookings = filterByPeriod(listQuery.data, period, scope);

  const periodOptions = [
    { value: 'all', label: t('bookings.periodAll') },
    { value: 'week', label: t('bookings.periodWeek') },
    { value: 'month', label: t('bookings.periodMonth') },
  ];

  const officeOptions = [
    { value: '', label: t('bookings.allOffices') },
    ...(officesQuery.data ?? []).map((o) => ({ value: o.id, label: o.name })),
  ];

  return (
    <PageBody>
      <HeadRow>
        <Heading>{t('bookings.heading')}</Heading>
        <HeadActions>
          {bookings && bookings.length > 0 && <ExportIcsButton bookings={bookings} bulk />}
          <Select
            options={officeOptions}
            value={officeId ?? ''}
            aria-label={t('bookings.allOffices')}
            onChange={(e) => {
              patch('office', e.target.value || null);
            }}
          />
          <Select
            options={periodOptions}
            value={period}
            leftIcon={<Calendar size={18} />}
            hideChevron
            aria-label={t('bookings.periodLabel')}
            onChange={(e) => {
              patch('period', e.target.value === 'all' ? null : e.target.value);
            }}
          />
        </HeadActions>
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
            label: t('bookings.tabUpcoming', { count: upcoming?.length ?? 0 }),
          },
          { value: 'past', label: t('bookings.tabPast') },
        ]}
      >
        {listQuery.isPending ? (
          <List>
            {Array.from({ length: 2 }, (_, i) => (
              <Skeleton key={i} height={126} radius="var(--radius-xl)" />
            ))}
          </List>
        ) : listQuery.isError || !bookings ? (
          <StateArea>
            <ErrorState
              description={t('bookings.errorText')}
              onRetry={() => void listQuery.refetch()}
            />
          </StateArea>
        ) : bookings.length === 0 ? (
          <StateArea>
            <EmptyState
              icon={<CalendarClock size={48} strokeWidth={1.75} />}
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
          </StateArea>
        ) : (
          <List>
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                cancellable={scope === 'upcoming'}
                onCancel={setCancelTarget}
                extraActions={<ExportIcsButton bookings={[booking]} />}
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
    </PageBody>
  );
}
