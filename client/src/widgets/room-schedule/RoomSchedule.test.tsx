import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { BookingView, Room, User } from '@/shared/api';
import { RoomSchedule } from './RoomSchedule';

const office = {
  id: 'office-moscow',
  name: 'Офис Москва',
  address: 'ул. Лесная, 7',
  timezone: 'Europe/Moscow',
};
const room: Room = {
  id: 'room-everest',
  officeId: 'office-moscow',
  name: 'Эверест',
  floor: 4,
  capacity: 12,
  features: [],
};
const owner: User = {
  id: 'user-konstantin',
  login: 'k',
  displayName: 'Константин Кузнецов',
  email: 'k@e.t',
  avatarUrl: null,
  initials: 'КК',
};
const other: User = { ...owner, id: 'user-anna', displayName: 'Анна', initials: 'АС' };

const makeBooking = (over: Partial<BookingView>): BookingView => ({
  id: 'b1',
  roomId: room.id,
  userId: owner.id,
  title: 'Daily Sync',
  comment: null,
  startsAt: '2026-10-24T11:00:00+03:00',
  endsAt: '2026-10-24T12:00:00+03:00',
  createdAt: '2026-10-20T00:00:00+03:00',
  room,
  office,
  owner,
  ...over,
});

function renderSchedule(bookings: BookingView[], onBookRoom = vi.fn()) {
  render(
    <MemoryRouter>
      <RoomSchedule
        bookings={bookings}
        currentUserId={owner.id}
        timezone="Europe/Moscow"
        date="2026-10-24"
        onDateChange={vi.fn()}
        onBookRoom={onBookRoom}
      />
    </MemoryRouter>,
  );
  return { onBookRoom };
}

describe('RoomSchedule', () => {
  it('показывает часы рабочего дня с 09:00 до 20:00', () => {
    renderSchedule([]);
    expect(screen.getByText('09:00')).toBeInTheDocument();
    expect(screen.getByText('20:00')).toBeInTheDocument();
    expect(screen.queryByText('08:00')).not.toBeInTheDocument();
  });

  it('свою бронь показывает с темой, а чужую как «Занято»', () => {
    renderSchedule([
      makeBooking({ id: 'mine', title: 'Daily Sync', userId: owner.id }),
      makeBooking({
        id: 'theirs',
        userId: other.id,
        owner: other,
        startsAt: '2026-10-24T15:00:00+03:00',
        endsAt: '2026-10-24T16:00:00+03:00',
      }),
    ]);

    expect(screen.getByText('Daily Sync')).toBeInTheDocument();
    expect(screen.getByText('Занято')).toBeInTheDocument();
  });

  it('вызывает onBookRoom по кнопке «Забронировать комнату»', async () => {
    const { onBookRoom } = renderSchedule([]);
    await userEvent.click(screen.getByRole('button', { name: 'Забронировать комнату' }));
    expect(onBookRoom).toHaveBeenCalledTimes(1);
  });

  it('обрезает брони по границам рабочего дня', () => {
    renderSchedule([
      makeBooking({
        id: 'early',
        title: 'Ранняя',
        startsAt: '2026-10-24T07:00:00+03:00',
        endsAt: '2026-10-24T10:00:00+03:00',
      }),
    ]);
    // блок отрисован (не отфильтрован), т.к. пересекается с рабочим днём
    expect(screen.getByText('Ранняя')).toBeInTheDocument();
  });
});
