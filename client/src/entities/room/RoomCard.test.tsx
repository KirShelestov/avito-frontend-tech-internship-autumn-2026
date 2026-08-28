import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { RoomSummary } from '@/shared/api';
import { RoomCard } from './RoomCard';

const baseRoom: RoomSummary = {
  id: 'room-everest',
  officeId: 'office-moscow',
  name: 'Эверест',
  floor: 4,
  capacity: 12,
  features: [],
  office: {
    id: 'office-moscow',
    name: 'Офис Москва',
    address: 'ул. Лесная, 7',
    timezone: 'Europe/Moscow',
  },
};

const renderCard = (room: RoomSummary, onBook = vi.fn()) => {
  render(
    <MemoryRouter>
      <RoomCard room={room} onBook={onBook} />
    </MemoryRouter>,
  );
  return { onBook };
};

describe('RoomCard', () => {
  it('показывает название, этаж и вместимость', () => {
    renderCard(baseRoom);
    expect(screen.getByRole('heading', { name: 'Эверест' })).toBeInTheDocument();
    expect(screen.getByText('4 этаж')).toBeInTheDocument();
    expect(screen.getByText('Вместимость: до 12 человек')).toBeInTheDocument();
  });

  it('без интервала не показывает бейдж доступности, кнопка активна', async () => {
    const { onBook } = renderCard(baseRoom);
    expect(screen.queryByText('Доступно на выбранное время')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Забронировать' }));
    expect(onBook).toHaveBeenCalledWith(baseRoom);
  });

  it('при available=false показывает бейдж и блокирует бронирование', () => {
    renderCard({ ...baseRoom, available: false });
    expect(screen.getByText('Недоступно на выбранное время')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Забронировать' })).toBeDisabled();
  });

  it('при available=true показывает зелёный бейдж и активную кнопку', () => {
    renderCard({ ...baseRoom, available: true });
    expect(screen.getByText('Доступно на выбранное время')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Забронировать' })).toBeEnabled();
  });

  it('ссылка «Подробнее» ведёт на страницу комнаты', () => {
    renderCard(baseRoom);
    expect(screen.getByRole('link', { name: 'Подробнее' })).toHaveAttribute(
      'href',
      '/rooms/room-everest',
    );
  });
});
