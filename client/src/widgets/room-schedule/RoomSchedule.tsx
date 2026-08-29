import { useTranslation } from 'react-i18next';
import type { BookingView } from '@/shared/api';
import { addDaysISO, formatDateHuman, MAX_ADVANCE_DAYS, todayISODate } from '@/shared/lib/date';
import { minutesOfDayInZone } from '@/shared/lib/datetime';
import { Button, DatePickerPopover } from '@/shared/ui';
import {
  DAY_END_MIN,
  DAY_START_MIN,
  DateLabel,
  Event,
  Footer,
  Grid,
  Head,
  HourCell,
  HourLine,
  Panel,
  ROW_HEIGHT,
  Title,
  Track,
} from './RoomSchedule.styles';

export interface RoomScheduleProps {
  bookings: BookingView[];
  currentUserId: string;
  timezone: string;
  date: string;
  onDateChange: (date: string) => void;
  onBookRoom: () => void;
}

const HOURS = Array.from(
  { length: DAY_END_MIN / 60 - DAY_START_MIN / 60 + 1 },
  (_, i) => DAY_START_MIN / 60 + i,
);

export function RoomSchedule({
  bookings,
  currentUserId,
  timezone,
  date,
  onDateChange,
  onBookRoom,
}: RoomScheduleProps) {
  const { t } = useTranslation();
  const today = todayISODate(timezone);

  return (
    <Panel aria-label={t('schedule.heading')}>
      <Head>
        <div>
          <Title>{t('schedule.heading')}</Title>
          <DateLabel>{formatDateHuman(date)}</DateLabel>
        </div>
        <DatePickerPopover
          value={date}
          minDate={today}
          maxDate={addDaysISO(today, MAX_ADVANCE_DAYS)}
          onChange={onDateChange}
          placeholder={t('schedule.pickDate')}
          aria-label={t('schedule.pickDate')}
        />
      </Head>

      <Grid>
        <div>
          {HOURS.map((hour) => (
            <HourCell key={hour}>{String(hour).padStart(2, '0')}:00</HourCell>
          ))}
        </div>
        <Track>
          {HOURS.slice(0, -1).map((hour) => (
            <HourLine key={hour} />
          ))}
          {bookings.map((booking) => {
            const startMin = Math.max(
              minutesOfDayInZone(booking.startsAt, timezone),
              DAY_START_MIN,
            );
            const endMin = Math.min(minutesOfDayInZone(booking.endsAt, timezone), DAY_END_MIN);
            if (endMin <= startMin) return null;
            const own = booking.userId === currentUserId;
            const top = ((startMin - DAY_START_MIN) / 60) * ROW_HEIGHT;
            const height = ((endMin - startMin) / 60) * ROW_HEIGHT;
            return (
              <Event key={booking.id} $top={top} $height={height} $own={own}>
                {own ? booking.title : t('schedule.busy')}
              </Event>
            );
          })}
        </Track>
      </Grid>

      <Footer>
        <Button onClick={onBookRoom}>{t('schedule.bookRoom')}</Button>
      </Footer>
    </Panel>
  );
}
