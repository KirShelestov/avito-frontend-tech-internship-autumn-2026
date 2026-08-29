import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { addDaysISO, MAX_ADVANCE_DAYS, todayISODate } from '@/shared/lib/date';
import { formatDuration, timeToMinutes } from '@/shared/lib/time';
import { DatePickerPopover, Select, TimeField } from '@/shared/ui';
import { Bar, Group, GroupLabel } from './RoomsFilterBar.styles';
import {
  CAPACITY_OPTIONS,
  DURATION_OPTIONS,
  STEP_MINUTES,
  WORKDAY_END_MINUTES,
  WORKDAY_START,
  type RoomsFilters,
} from './useRoomsFilters';

export interface RoomsFilterBarProps {
  filters: RoomsFilters;
  timezone: string;
  disabled?: boolean;
  onDateChange: (date: string) => void;
  onStartChange: (start: string) => void;
  onDurationChange: (duration: number) => void;
  onCapacityChange: (capacity: number | null) => void;
}

export function RoomsFilterBar({
  filters,
  timezone,
  disabled = false,
  onDateChange,
  onStartChange,
  onDurationChange,
  onCapacityChange,
}: RoomsFilterBarProps) {
  const { t } = useTranslation();

  const today = todayISODate(timezone);
  const maxDate = addDaysISO(today, MAX_ADVANCE_DAYS);
  const startMinutes = timeToMinutes(filters.start) ?? 9 * 60;

  const durationOptions = DURATION_OPTIONS.filter(
    (minutes) => startMinutes + minutes <= WORKDAY_END_MINUTES,
  ).map((minutes) => ({ value: String(minutes), label: formatDuration(minutes) }));

  const capacityOptions = [
    { value: '', label: t('filters.capacityAny') },
    ...CAPACITY_OPTIONS.map((n) => ({
      value: String(n),
      label: t('filters.capacityValue', { count: n }),
    })),
  ];

  return (
    <Bar>
      <Group>
        <GroupLabel>{t('filters.date')}</GroupLabel>
        <DatePickerPopover
          value={disabled ? '' : filters.date}
          placeholder={t('filters.datePlaceholder')}
          minDate={today}
          maxDate={maxDate}
          disabled={disabled}
          onChange={onDateChange}
          aria-label={t('filters.date')}
        />
      </Group>

      <Group>
        <GroupLabel>{t('filters.startTime')}</GroupLabel>
        <TimeField
          value={disabled ? '' : filters.start}
          disabled={disabled}
          step={STEP_MINUTES}
          minTime={WORKDAY_START}
          maxTime="19:45"
          aria-label={t('filters.startTime')}
          onChange={onStartChange}
        />
      </Group>

      <Group>
        <GroupLabel>{t('filters.duration')}</GroupLabel>
        <Select
          options={durationOptions}
          placeholder={t('filters.durationPlaceholder')}
          value={disabled ? '' : String(filters.duration)}
          disabled={disabled}
          aria-label={t('filters.duration')}
          onChange={(e) => {
            onDurationChange(Number(e.target.value));
          }}
        />
      </Group>

      <Group>
        <GroupLabel>{t('filters.capacity')}</GroupLabel>
        <Select
          options={capacityOptions}
          value={filters.capacity ? String(filters.capacity) : ''}
          disabled={disabled}
          leftIcon={<Users size={18} />}
          hideChevron
          aria-label={t('filters.capacity')}
          onChange={(e) => {
            onCapacityChange(e.target.value ? Number(e.target.value) : null);
          }}
        />
      </Group>
    </Bar>
  );
}
