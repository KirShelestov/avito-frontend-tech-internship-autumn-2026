import * as Popover from '@radix-ui/react-popover';
import { CalendarDays } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateHuman } from '@/shared/lib/date';
import { Calendar } from './Calendar';
import { Content, Trigger } from './DatePickerPopover.styles';

export interface DatePickerPopoverProps {
  value: string;
  onChange: (iso: string) => void;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  formatLabel?: (iso: string) => ReactNode;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

export function DatePickerPopover({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder,
  invalid = false,
  disabled = false,
  formatLabel = formatDateHuman,
  id,
  className,
  'aria-label': ariaLabel,
}: DatePickerPopoverProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Trigger
        id={id}
        className={className}
        $invalid={invalid}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        <CalendarDays size={16} aria-hidden="true" />
        {value ? formatLabel(value) : (placeholder ?? t('calendar.open'))}
      </Trigger>
      <Popover.Portal>
        <Content sideOffset={6} align="start">
          <Calendar
            value={value}
            minDate={minDate}
            maxDate={maxDate}
            onChange={(iso) => {
              onChange(iso);
              setOpen(false);
            }}
          />
        </Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
