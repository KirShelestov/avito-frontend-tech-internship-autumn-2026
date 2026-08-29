import { api, HttpError, type CreateBookingPayload } from '@/shared/api';

export interface SeriesItemInput {
  date: string;
  payload: CreateBookingPayload;
}

export type SeriesItemStatus = 'created' | 'conflict' | 'error';

export interface SeriesItemResult {
  date: string;
  status: SeriesItemStatus;
}

const CONCURRENCY = 3;

/**
 * Создаёт брони серии с ограниченным параллелизмом.
 * Уже созданные при частичном сбое не откатываются.
 */
export async function createBookingSeries(
  items: SeriesItemInput[],
  onProgress?: (done: number, total: number) => void,
): Promise<SeriesItemResult[]> {
  const results: SeriesItemResult[] = new Array<SeriesItemResult>(items.length);
  let cursor = 0;
  let done = 0;

  async function worker(): Promise<void> {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      const item = items[index]!;
      try {
        await api.createBooking(item.payload);
        results[index] = { date: item.date, status: 'created' };
      } catch (error) {
        results[index] = {
          date: item.date,
          status: error instanceof HttpError && error.isConflict ? 'conflict' : 'error',
        };
      } finally {
        done += 1;
        onProgress?.(done, items.length);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, () => worker()));

  return results;
}
