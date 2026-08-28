import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Office } from '@/shared/api';
import { todayISODate } from '@/shared/lib/date';
import { addMinutesIso, nextSlotTime, zonedIso } from '@/shared/lib/datetime';

export const DURATION_OPTIONS = [15, 30, 45, 60, 75, 90, 105, 120];
export const CAPACITY_OPTIONS = [2, 4, 6, 8, 10, 12];
export const STEP_MINUTES = 15;
export const WORKDAY_START = '09:00';
export const WORKDAY_END_MINUTES = 20 * 60;

export interface RoomsFilters {
  officeId: string | null;
  date: string;
  start: string;
  duration: number;
  capacity: number | null;
}

export interface UseRoomsFiltersResult {
  filters: RoomsFilters;
  office: Office | undefined;
  timezone: string;
  /** undefined, пока офис не выбран */
  from: string | undefined;
  to: string | undefined;
  setOffice: (officeId: string) => void;
  setDate: (date: string) => void;
  setStart: (start: string) => void;
  setDuration: (duration: number) => void;
  setCapacity: (capacity: number | null) => void;
  reset: () => void;
}

export function useRoomsFilters(offices: Office[] | undefined): UseRoomsFiltersResult {
  const [params, setParams] = useSearchParams();

  const officeId = params.get('office');
  const office = offices?.find((o) => o.id === officeId);
  const timezone = office?.timezone ?? 'Europe/Moscow';

  const date = params.get('date') ?? todayISODate(timezone);
  const start = params.get('start') ?? nextSlotTime(timezone, STEP_MINUTES);
  const duration = Number(params.get('duration') ?? '60');
  const capacityRaw = params.get('capacity');
  const capacity = capacityRaw ? Number(capacityRaw) : null;

  const patch = useCallback(
    (updates: Record<string, string | null>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(updates)) {
            if (value === null) next.delete(key);
            else next.set(key, value);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const from = officeId ? zonedIso(date, start, timezone) : undefined;
  const to = from ? addMinutesIso(from, duration) : undefined;

  return useMemo(
    () => ({
      filters: { officeId, date, start, duration, capacity },
      office,
      timezone,
      from,
      to,
      setOffice: (value: string) => patch({ office: value }),
      setDate: (value: string) => patch({ date: value }),
      setStart: (value: string) => patch({ start: value }),
      setDuration: (value: number) => patch({ duration: String(value) }),
      setCapacity: (value: number | null) => patch({ capacity: value ? String(value) : null }),
      reset: () => patch({ date: null, start: null, duration: null, capacity: null }),
    }),
    [officeId, date, start, duration, capacity, office, timezone, from, to, patch],
  );
}
