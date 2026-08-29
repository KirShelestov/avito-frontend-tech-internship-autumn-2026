import { Monitor, PenLine, Users, Video, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { useRoomSchedule } from '@/entities/booking';
import { useRoom } from '@/entities/room';
import { useMe } from '@/entities/user';
import { NotFoundPage } from '@/pages/not-found';
import { RoomSchedule } from '@/widgets/room-schedule';
import { HttpError, type RoomFeature } from '@/shared/api';
import { todayISODate } from '@/shared/lib/date';
import { Breadcrumbs, ErrorState, Skeleton } from '@/shared/ui';
import {
  Columns,
  Crumbs,
  FeatureItem,
  FeatureList,
  InfoCard,
  OfficeLine,
  RoomName,
} from './RoomDetailsPage.styles';

const FEATURE_ICONS: Record<string, LucideIcon> = {
  display: Monitor,
  whiteboard: PenLine,
  video: Video,
};

function FeatureRow({ feature }: { feature: RoomFeature }) {
  const Icon = FEATURE_ICONS[feature.code] ?? Monitor;
  return (
    <FeatureItem>
      <Icon size={16} />
      {feature.name}
    </FeatureItem>
  );
}

export function RoomDetailsPage() {
  const { t } = useTranslation();
  const { roomId } = useParams();
  const [params, setParams] = useSearchParams();

  const roomQuery = useRoom(roomId);
  const { data: me } = useMe();

  const timezone = roomQuery.data?.office.timezone ?? 'Europe/Moscow';
  const date = params.get('date') ?? todayISODate(timezone);
  const setDate = (value: string) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('date', value);
        return next;
      },
      { replace: true },
    );
  };

  const scheduleQuery = useRoomSchedule(roomId, date, timezone);

  if (roomQuery.error instanceof HttpError && roomQuery.error.status === 404) {
    return <NotFoundPage />;
  }

  if (roomQuery.isPending) {
    return (
      <Columns>
        <InfoCard>
          <Skeleton width="60%" height={26} />
          <OfficeLine>
            <Skeleton width="80%" height={14} />
          </OfficeLine>
          <FeatureList>
            {Array.from({ length: 4 }, (_, i) => (
              <li key={i}>
                <Skeleton height={14} />
              </li>
            ))}
          </FeatureList>
        </InfoCard>
        <Skeleton height={520} />
      </Columns>
    );
  }

  if (roomQuery.isError) {
    return <ErrorState onRetry={() => void roomQuery.refetch()} />;
  }

  const room = roomQuery.data;

  return (
    <>
      <Crumbs>
        <Breadcrumbs
          items={[
            { label: t('roomDetails.crumbRooms'), href: '/rooms' },
            { label: room.office.name, href: `/rooms?office=${room.office.id}` },
            { label: t('roomDetails.crumbRoom', { name: room.name }) },
          ]}
        />
      </Crumbs>

      <Columns>
        <InfoCard>
          <RoomName>{room.name}</RoomName>
          <OfficeLine>
            {room.office.name} · {room.office.address}
          </OfficeLine>
          <FeatureList>
            <FeatureItem>
              <Users size={16} />
              {t('roomDetails.capacity', { count: room.capacity })}
            </FeatureItem>
            {room.features.map((feature) => (
              <FeatureRow key={feature.code} feature={feature} />
            ))}
          </FeatureList>
        </InfoCard>

        {scheduleQuery.isError ? (
          <ErrorState
            title={t('schedule.errorTitle')}
            description={t('schedule.errorText')}
            onRetry={() => void scheduleQuery.refetch()}
          />
        ) : scheduleQuery.isPending ? (
          <Skeleton height={520} />
        ) : (
          <RoomSchedule
            bookings={scheduleQuery.data}
            currentUserId={me?.id ?? ''}
            timezone={timezone}
            date={date}
            onDateChange={setDate}
            onBookRoom={() => {
              /* модалка бронирования появится на следующем этапе */
            }}
          />
        )}
      </Columns>
    </>
  );
}
