import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HttpError, type CreateBookingPayload, type RoomSummary } from '@/shared/api';
import { addDaysISO, formatDateHuman, MAX_ADVANCE_DAYS, todayISODate } from '@/shared/lib/date';
import { addMinutesIso, formatDateInZone, formatTimeInZone, zoneAbbr } from '@/shared/lib/datetime';
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
import { createBookingSeries, expandRecurrence } from '@/features/recurring-booking';
import { DURATION_OPTIONS } from '@/features/rooms-filters';
import {
  FieldBlock,
  FieldCaption,
  FieldError,
  Form,
  Preview,
  SeriesLine,
  SeriesResult,
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

interface SeriesSummary {
  created: number;
  total: number;
  conflicts: string[];
  errors: string[];
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
  const queryClient = useQueryClient();
  const timezone = room.office.timezone;
  const createBooking = useCreateBooking();

  const [conflict, setConflict] = useState(false);
  const [seriesRunning, setSeriesRunning] = useState(false);
  const [seriesSummary, setSeriesSummary] = useState<SeriesSummary | null>(null);

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
      repeat: 'none',
      repeatUntil: addDaysISO(initialDate ?? today, 14),
    },
  });

  const date = watch('date');
  const start = watch('start');
  const duration = watch('duration');
  const repeat = watch('repeat');

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

  const repeatOptions = [
    { value: 'none', label: t('createBooking.repeatNone') },
    { value: 'daily', label: t('createBooking.repeatDaily') },
    { value: 'weekly', label: t('createBooking.repeatWeekly') },
    { value: 'weekdays', label: t('createBooking.repeatWeekdays') },
  ];

  const endTime = minutesToTime(startMinutes + duration);
  const previewText = t('createBooking.preview', {
    date: formatDateHuman(date),
    start,
    end: endTime,
    duration: formatDuration(duration),
  });

  const invalidateAll = () => {
    void queryClient.invalidateQueries({ queryKey: ['room-schedule', room.id] });
    void queryClient.invalidateQueries({ queryKey: ['rooms', room.office.id] });
    void queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
  };

  const close = () => {
    reset();
    setConflict(false);
    setSeriesSummary(null);
    setSeriesRunning(false);
    onOpenChange(false);
  };

  const buildPayload = (dayIso: string, values: BookingFormValues): CreateBookingPayload => {
    const startsAt = toStartIso({ date: dayIso, start: values.start }, timezone);
    return {
      roomId: room.id,
      title: values.title,
      comment: values.comment || null,
      startsAt,
      endsAt: addMinutesIso(startsAt, values.duration),
    };
  };

  const submitSingle = async (values: BookingFormValues) => {
    const payload = buildPayload(values.date, values);
    try {
      await createBooking.mutateAsync(payload);
      toast({
        tone: 'success',
        title: t('createBooking.successTitle'),
        description: t('createBooking.successBody', {
          room: room.name,
          date: formatDateHuman(payload.startsAt.slice(0, 10)),
          start: formatTimeInZone(payload.startsAt, timezone),
          end: formatTimeInZone(payload.endsAt, timezone),
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
  };

  const submitSeries = async (values: BookingFormValues) => {
    const dates = expandRecurrence({
      startDate: values.date,
      frequency: values.repeat,
      until: values.repeatUntil,
      today,
    });
    const items = dates.map((day) => ({ date: day, payload: buildPayload(day, values) }));

    setSeriesRunning(true);
    const results = await createBookingSeries(items);
    setSeriesRunning(false);
    invalidateAll();

    setSeriesSummary({
      created: results.filter((r) => r.status === 'created').length,
      total: results.length,
      conflicts: results.filter((r) => r.status === 'conflict').map((r) => r.date),
      errors: results.filter((r) => r.status === 'error').map((r) => r.date),
    });
  };

  const onSubmit = handleSubmit(async (values) => {
    if (values.repeat === 'none') {
      await submitSingle(values);
    } else {
      await submitSeries(values);
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

  if (seriesSummary) {
    const humanDates = (list: string[]) =>
      list.map((d) => formatDateInZone(`${d}T00:00:00`, timezone)).join(', ');
    return (
      <Modal
        open={open}
        onOpenChange={close}
        size="sm"
        title={t('createBooking.seriesTitle')}
        footer={<Button onClick={close}>{t('createBooking.done')}</Button>}
      >
        <SeriesResult>
          <SeriesLine>
            <b>
              {t('createBooking.seriesSummary', {
                created: seriesSummary.created,
                total: seriesSummary.total,
              })}
            </b>
          </SeriesLine>
          {seriesSummary.conflicts.length > 0 && (
            <SeriesLine $tone="warn">
              {t('createBooking.seriesConflicts', { dates: humanDates(seriesSummary.conflicts) })}
            </SeriesLine>
          )}
          {seriesSummary.errors.length > 0 && (
            <SeriesLine $tone="warn">
              {t('createBooking.seriesErrors', { dates: humanDates(seriesSummary.errors) })}
            </SeriesLine>
          )}
        </SeriesResult>
      </Modal>
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
          <Button
            type="submit"
            form="create-booking-form"
            loading={createBooking.isPending || seriesRunning}
          >
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

        <TwoCols>
          <Controller
            control={control}
            name="repeat"
            render={({ field }) => (
              <Select
                label={t('createBooking.repeat')}
                fullWidth
                options={repeatOptions}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
              />
            )}
          />
          {repeat !== 'none' && (
            <FieldBlock>
              <FieldCaption>{t('createBooking.repeatUntil')}</FieldCaption>
              <Controller
                control={control}
                name="repeatUntil"
                render={({ field }) => (
                  <DatePickerPopover
                    value={field.value}
                    minDate={date}
                    maxDate={addDaysISO(today, MAX_ADVANCE_DAYS)}
                    onChange={field.onChange}
                    aria-label={t('createBooking.repeatUntil')}
                  />
                )}
              />
            </FieldBlock>
          )}
        </TwoCols>

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
