import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HttpError, type RoomSummary } from '@/shared/api';
import { addDaysISO, formatDateHuman, MAX_ADVANCE_DAYS, todayISODate } from '@/shared/lib/date';
import { addMinutesIso, formatTimeInZone, zoneAbbr } from '@/shared/lib/datetime';
import { formatDuration, minutesToTime, timeToMinutes } from '@/shared/lib/time';
import {
  Button,
  DatePickerPopover,
  Input,
  Modal,
  Select,
  Textarea,
  TimeField,
  useToast,
} from '@/shared/ui';
import { DURATION_OPTIONS } from '@/features/rooms-filters';
import {
  FieldBlock,
  FieldCaption,
  FieldError,
  Form,
  Preview,
  TwoCols,
} from './CreateBookingDialog.styles';
import { createBookingSchema, toStartIso, type BookingFormValues } from './model/schema';
import { useCreateBooking } from './useCreateBooking';

const WORKDAY_END_MIN = 20 * 60;

export interface CreateBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: RoomSummary;
  initialDate?: string;
  initialStart?: string;
}

export function CreateBookingDialog({
  open,
  onOpenChange,
  room,
  initialDate,
  initialStart,
}: CreateBookingDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const timezone = room.office.timezone;
  const createBooking = useCreateBooking();
  const [conflict, setConflict] = useState(false);

  const today = todayISODate(timezone);
  const resolver = useMemo(() => zodResolver(createBookingSchema({ timezone })), [timezone]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver,
    defaultValues: {
      title: '',
      date: initialDate ?? today,
      start: initialStart ?? '10:00',
      duration: 60,
      comment: '',
    },
  });

  const date = watch('date');
  const start = watch('start');
  const duration = watch('duration');

  const startMinutes = timeToMinutes(start) ?? 9 * 60;
  const durationOptions = DURATION_OPTIONS.filter((m) => startMinutes + m <= WORKDAY_END_MIN).map(
    (m) => ({
      value: String(m),
      label: t('createBooking.durationOption', {
        label: formatDuration(m),
        end: minutesToTime(startMinutes + m),
      }),
    }),
  );

  const endTime = minutesToTime(startMinutes + duration);
  const previewText = t('createBooking.preview', {
    date: formatDateHuman(date),
    start,
    end: endTime,
    duration: formatDuration(duration),
  });

  const close = () => {
    reset();
    setConflict(false);
    onOpenChange(false);
  };

  const onSubmit = handleSubmit(async (values) => {
    const startsAt = toStartIso(values, timezone);
    const endsAt = addMinutesIso(startsAt, values.duration);
    try {
      await createBooking.mutateAsync({
        roomId: room.id,
        title: values.title,
        comment: values.comment || null,
        startsAt,
        endsAt,
      });
      toast({
        tone: 'success',
        title: t('createBooking.successTitle'),
        description: t('createBooking.successBody', {
          room: room.name,
          date: formatDateHuman(startsAt.slice(0, 10)),
          start: formatTimeInZone(startsAt, timezone),
          end: formatTimeInZone(endsAt, timezone),
          zone: zoneAbbr(timezone),
        }),
      });
      close();
    } catch (error) {
      if (error instanceof HttpError && error.isConflict) {
        setConflict(true);
        return;
      }
      toast({ tone: 'error', title: t('createBooking.errors.generic') });
    }
  });

  const err = (key: keyof BookingFormValues): string | undefined => {
    const message = errors[key]?.message;
    return message ? t(message as never) : undefined;
  };

  if (conflict) {
    return (
      <Modal
        open={open}
        onOpenChange={close}
        size="sm"
        hideCloseButton
        title={t('createBooking.conflictTitle')}
        description={t('createBooking.conflictText')}
        footer={
          <Button onClick={() => setConflict(false)}>{t('createBooking.conflictAction')}</Button>
        }
      />
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : close())}
      title={t('createBooking.title')}
      description={t('createBooking.subtitle', {
        room: room.name,
        office: room.office.name,
        floor: room.floor,
      })}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={close}>
            {t('actions.cancel')}
          </Button>
          <Button type="submit" form="create-booking-form" loading={createBooking.isPending}>
            {t('createBooking.submit')}
          </Button>
        </>
      }
    >
      <Form id="create-booking-form" onSubmit={onSubmit} noValidate>
        <Input
          label={t('createBooking.titleField')}
          placeholder={t('createBooking.titlePlaceholder')}
          required
          fullWidth
          error={err('title')}
          {...register('title')}
        />

        <TwoCols>
          <FieldBlock>
            <FieldCaption>{t('createBooking.date')}</FieldCaption>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePickerPopover
                  value={field.value}
                  minDate={today}
                  maxDate={addDaysISO(today, MAX_ADVANCE_DAYS)}
                  onChange={field.onChange}
                  aria-label={t('createBooking.date')}
                  invalid={Boolean(errors.date)}
                />
              )}
            />
            {err('date') && <FieldError role="alert">{err('date')}</FieldError>}
          </FieldBlock>

          <FieldBlock>
            <FieldCaption>{t('createBooking.start')}</FieldCaption>
            <Controller
              control={control}
              name="start"
              render={({ field }) => (
                <TimeField
                  value={field.value}
                  onChange={field.onChange}
                  aria-label={t('createBooking.start')}
                  error={err('start')}
                />
              )}
            />
          </FieldBlock>
        </TwoCols>

        <Controller
          control={control}
          name="duration"
          render={({ field }) => (
            <Select
              label={t('createBooking.duration')}
              fullWidth
              options={durationOptions}
              value={String(field.value)}
              onChange={(e) => {
                field.onChange(Number(e.target.value));
              }}
              error={err('duration')}
            />
          )}
        />

        <Textarea
          label={t('createBooking.comment')}
          placeholder={t('createBooking.commentPlaceholder')}
          fullWidth
          {...register('comment')}
        />

        <Preview>
          <Info size={16} />
          {previewText}
        </Preview>
      </Form>
    </Modal>
  );
}
