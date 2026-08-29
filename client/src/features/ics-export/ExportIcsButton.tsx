import { CalendarPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { BookingView } from '@/shared/api';
import { Button } from '@/shared/ui';
import { downloadFile } from './download';
import { buildIcsCalendar, icsFileName } from './ics';

export interface ExportIcsButtonProps {
  bookings: BookingView[];
  /** Кнопка «Скачать всё» вместо экспорта одной брони */
  bulk?: boolean;
  size?: 'sm' | 'md';
}

export function ExportIcsButton({ bookings, bulk = false, size = 'sm' }: ExportIcsButtonProps) {
  const { t } = useTranslation();
  if (bookings.length === 0) return null;

  const handleClick = () => {
    const content = buildIcsCalendar(bookings);
    const base = bulk || bookings.length > 1 ? t('ics.allFileBase') : bookings[0]!.title;
    downloadFile(icsFileName(base), content);
  };

  return (
    <Button
      variant="ghost"
      size={size}
      leftIcon={<CalendarPlus size={16} />}
      onClick={handleClick}
      aria-label={bulk ? t('ics.exportAll') : t('ics.exportOneAria', { title: bookings[0]!.title })}
    >
      {bulk ? t('ics.exportAll') : t('ics.exportOne')}
    </Button>
  );
}
