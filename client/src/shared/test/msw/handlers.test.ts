import { describe, expect, it } from 'vitest';
import { api } from '@/shared/api';
import { HttpError } from '@/shared/api/errors';
import { setupMswServer } from '../setup-msw';

setupMswServer();

const inDays = (days: number, hour: number, minute = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

describe('MSW handlers', () => {
  it('отдаёт текущего пользователя и офисы', async () => {
    expect(await api.getMe()).toMatchObject({ login: 'kkuznetsov' });
    const { items } = await api.listOffices();
    expect(items.map((o) => o.id)).toContain('office-moscow');
  });

  it('фильтрует комнаты по офису и вместимости, считает доступность', async () => {
    const { items } = await api.listRooms({
      officeId: 'office-moscow',
      minCapacity: 8,
      from: inDays(1, 15),
      to: inDays(1, 16),
    });
    const ids = items.map((r) => r.id);
    expect(ids).toEqual(['room-everest', 'room-kazbek']);
    // Эверест занят сидовой бронью на +1 день 15:00–16:00
    expect(items.find((r) => r.id === 'room-everest')?.available).toBe(false);
    expect(items.find((r) => r.id === 'room-kazbek')?.available).toBe(true);
  });

  it('требует officeId для списка комнат', async () => {
    await expect(api.listRooms({ officeId: '' })).rejects.toBeInstanceOf(HttpError);
  });

  it('возвращает предстоящие брони текущего пользователя', async () => {
    const { items } = await api.listBookings({ scope: 'upcoming' });
    expect(items.map((b) => b.id)).toEqual([
      'booking-future-current-user',
      'booking-future-current-user-2',
    ]);
  });

  it('создаёт бронь и отдаёт 409 при пересечении', async () => {
    const created = await api.createBooking({
      roomId: 'room-altai',
      title: 'Планёрка',
      startsAt: inDays(3, 10),
      endsAt: inDays(3, 11),
    });
    expect(created).toMatchObject({ roomId: 'room-altai', title: 'Планёрка' });

    const conflict = await api
      .createBooking({
        roomId: 'room-altai',
        title: 'Ещё одна',
        startsAt: inDays(3, 10, 30),
        endsAt: inDays(3, 11, 30),
      })
      .catch((e: unknown) => e);
    expect(conflict).toBeInstanceOf(HttpError);
    expect((conflict as HttpError).isConflict).toBe(true);
  });

  it('отменяет свою будущую бронь и запрещает чужую', async () => {
    await expect(api.cancelBooking('booking-future-current-user')).resolves.toBeUndefined();

    const forbidden = await api.cancelBooking('booking-future-other-user').catch((e: unknown) => e);
    expect((forbidden as HttpError).status).toBe(403);
  });

  it('сбрасывает данные через /test/reset', async () => {
    await api.cancelBooking('booking-future-current-user-2');
    await api.createBooking({
      roomId: 'room-neva',
      title: 'temp',
      startsAt: inDays(4, 12),
      endsAt: inDays(4, 13),
    });

    await fetch('http://localhost:3000/api/v1/test/reset', { method: 'POST' });

    const { items } = await api.listBookings({ scope: 'all' });
    expect(items.map((b) => b.id).sort()).toEqual(
      [
        'booking-future-current-user',
        'booking-future-current-user-2',
        'booking-past-current-user',
      ].sort(),
    );
  });
});
