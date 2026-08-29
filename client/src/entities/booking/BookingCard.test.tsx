import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { BookingView } from '@/shared/api';

import { BookingCard } from './BookingCard';

const booking: BookingView = {
  id: 'b1',
  roomId: 'room-everest',
  userId: 'user-konstantin',
  title: 'Daily Sync: Разработка & Продукт',
  comment: null,
  startsAt: '2026-10-24T15:00:00+03:00',
  endsAt: '2026-10-24T16:00:00+03:00',
  createdAt: '2026-10-20T00:00:00+03:00',
  room: {
    id: 'room-everest',
    officeId: 'office-moscow',
    name: 'Эверест',
    floor: 4,
    capacity: 12,
    features: [],
  },
  office: {
    id: 'office-moscow',
    name: 'Офис Москва',
    address: 'ул. Лесная, 7',
    timezone: 'Europe/Moscow',
  },
  owner: {
    id: 'user-konstantin',
    login: 'k',
    displayName: 'Константин',
    email: 'k@e.t',
    avatarUrl: null,
    initials: 'КК',
  },
};

describe('BookingCard', () => {
  it('показывает тему, комнату и время', () => {
    render(<BookingCard booking={booking} />);
    expect(screen.getByRole('heading', { name: /Daily Sync/ })).toBeInTheDocument();
    expect(screen.getByText('Эверест')).toBeInTheDocument();
    expect(screen.getByText(/15:00 – 16:00/)).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
  });

  it('без cancellable не показывает кнопку отмены', () => {
    render(<BookingCard booking={booking} />);
    expect(screen.queryByRole('button', { name: 'Отменить' })).not.toBeInTheDocument();
  });

  it('с cancellable вызывает onCancel', async () => {
    const onCancel = vi.fn();
    render(<BookingCard booking={booking} cancellable onCancel={onCancel} />);
    await userEvent.click(screen.getByRole('button', { name: 'Отменить' }));
    expect(onCancel).toHaveBeenCalledWith(booking);
  });
});
