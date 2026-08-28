import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  addDaysISO,
  buildMonthGrid,
  formatDateHuman,
  formatMonthTitle,
  shortWeekdays,
  todayISODate,
} from '@/shared/lib/date';
import {
  CalendarRoot,
  DayButton,
  Grid,
  Head,
  MonthTitle,
  NavButton,
  WeekdayCell,
} from './Calendar.styles';

export interface CalendarProps {
  value: string;
  onChange: (iso: string) => void;
  minDate?: string;
  maxDate?: string;
  className?: string;
}

const monthAnchorOf = (iso: string): string => `${iso.slice(0, 7)}-01`;

export function Calendar({ value, onChange, minDate, maxDate, className }: CalendarProps) {
  const { t } = useTranslation();
  const today = todayISODate();
  const [anchor, setAnchor] = useState(() => monthAnchorOf(value || today));

  const weeks = useMemo(() => buildMonthGrid(anchor), [anchor]);
  const weekdays = useMemo(() => shortWeekdays(), []);

  const prevAnchor = addDaysISO(anchor, -1).slice(0, 7) + '-01';
  const nextAnchor = addDaysISO(`${anchor.slice(0, 7)}-28`, 7).slice(0, 7) + '-01';

  const canGoPrev = !minDate || prevAnchor >= monthAnchorOf(minDate);
  const canGoNext = !maxDate || nextAnchor <= monthAnchorOf(maxDate);

  const isDisabled = (iso: string): boolean =>
    (minDate != null && iso < minDate) || (maxDate != null && iso > maxDate);

  return (
    <CalendarRoot className={className} role="group" aria-label={t('calendar.label')}>
      <Head>
        <NavButton
          type="button"
          aria-label={t('calendar.prevMonth')}
          disabled={!canGoPrev}
          onClick={() => setAnchor(prevAnchor)}
        >
          <ChevronLeft size={16} />
        </NavButton>
        <MonthTitle aria-live="polite">{formatMonthTitle(anchor)}</MonthTitle>
        <NavButton
          type="button"
          aria-label={t('calendar.nextMonth')}
          disabled={!canGoNext}
          onClick={() => setAnchor(nextAnchor)}
        >
          <ChevronRight size={16} />
        </NavButton>
      </Head>

      <Grid role="grid">
        {weekdays.map((weekday) => (
          <WeekdayCell key={weekday} role="columnheader" aria-label={weekday}>
            {weekday}
          </WeekdayCell>
        ))}
        {weeks.flat().map((cell) => {
          const selected = cell.iso === value;
          return (
            <DayButton
              key={cell.iso}
              type="button"
              $selected={selected}
              $outside={!cell.inCurrentMonth}
              $today={cell.iso === today}
              disabled={isDisabled(cell.iso)}
              aria-label={formatDateHuman(cell.iso)}
              aria-pressed={selected}
              aria-current={cell.iso === today ? 'date' : undefined}
              onClick={() => onChange(cell.iso)}
            >
              <span aria-hidden="true">{cell.day}</span>
            </DayButton>
          );
        })}
      </Grid>
    </CalendarRoot>
  );
}
