import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import type { RoomSummary } from '@/shared/api';
import { env } from '@/shared/config/env';
import { addDaysISO, todayISODate } from '@/shared/lib/date';
import { renderWithProviders } from '@/shared/test/renderWithProviders';
import { setupMswServer } from '@/shared/test/setup-msw';
import { mswServer } from '@/shared/test/msw/server';
import { CreateBookingDialog } from './CreateBookingDialog';

setupMswServer();

const room: RoomSummary = {
  id: 'room-altai',
  officeId: 'office-moscow',
  name: 'Алтай',
  floor: 2,
  capacity: 4,
  features: [],
  office: {
    id: 'office-moscow',
    name: 'Офис Москва',
    address: 'Москва, ул. Лесная, 7',
    timezone: 'Europe/Moscow',
  },
};

const tomorrow = addDaysISO(todayISODate('Europe/Moscow'), 1);

function renderDialog(onOpenChange = vi.fn()) {
  return {
    onOpenChange,
    ...renderWithProviders(
      <CreateBookingDialog
        open
        room={room}
        initialDate={tomorrow}
        initialStart="10:00"
        onOpenChange={onOpenChange}
      />,
    ),
  };
}

describe('CreateBookingDialog', () => {
  it('показывает заголовок и подзаголовок с комнатой', () => {
    renderDialog();
    expect(screen.getByRole('dialog')).toHaveAccessibleName('Новое бронирование');
    expect(screen.getByText(/Переговорная: Алтай/)).toBeInTheDocument();
  });

  it('без темы встречи не отправляет и показывает ошибку', async () => {
    const { user, onOpenChange } = renderDialog();

    await user.click(screen.getByRole('button', { name: 'Забронировать' }));

    expect(await screen.findByText('Обязательное поле')).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it('создаёт бронь: тост об успехе и закрытие', async () => {
    const { user, onOpenChange } = renderDialog();

    await user.type(screen.getByLabelText(/Тема встречи/), 'Планёрка');
    await user.click(screen.getByRole('button', { name: 'Забронировать' }));

    expect(await screen.findByText('Бронирование создано')).toBeInTheDocument();
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('серия: создаёт несколько броней и показывает сводку', async () => {
    const { user } = renderDialog();

    await user.type(screen.getByLabelText(/Тема встречи/), 'Ежедневный синк');
    await user.selectOptions(screen.getByLabelText('Повторять'), 'weekly');
    await user.click(screen.getByRole('button', { name: 'Забронировать' }));

    expect(await screen.findByRole('dialog', { name: 'Серия бронирований' })).toBeInTheDocument();
    expect(screen.getByText(/Создано \d+ из \d+/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Готово' })).toBeInTheDocument();
  });

  it('серия: помечает конфликтные даты в сводке', async () => {
    let call = 0;
    mswServer.use(
      http.post(`${env.apiUrl}/api/v1/bookings`, () => {
        call += 1;
        if (call === 1) {
          return HttpResponse.json(
            { error: { code: 'BOOKING_CONFLICT', message: 'занято' } },
            { status: 409 },
          );
        }
        return HttpResponse.json({ id: `b${String(call)}` }, { status: 201 });
      }),
    );

    const { user } = renderDialog();
    await user.type(screen.getByLabelText(/Тема встречи/), 'Синк');
    await user.selectOptions(screen.getByLabelText('Повторять'), 'weekly');
    await user.click(screen.getByRole('button', { name: 'Забронировать' }));

    expect(await screen.findByText(/Заняты даты:/)).toBeInTheDocument();
  });

  it('при 409 показывает модалку конфликта и возвращает к форме', async () => {
    mswServer.use(
      http.post(`${env.apiUrl}/api/v1/bookings`, () =>
        HttpResponse.json(
          { error: { code: 'BOOKING_CONFLICT', message: 'занято' } },
          { status: 409 },
        ),
      ),
    );

    const { user } = renderDialog();

    await user.type(screen.getByLabelText(/Тема встречи/), 'Планёрка');
    await user.click(screen.getByRole('button', { name: 'Забронировать' }));

    expect(await screen.findByText('Время уже занято')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Выбрать другое время' }));

    expect(await screen.findByLabelText(/Тема встречи/)).toBeInTheDocument();
  });
});
