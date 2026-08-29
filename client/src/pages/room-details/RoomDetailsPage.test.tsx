import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { env } from '@/shared/config/env';
import { addDaysISO, todayISODate } from '@/shared/lib/date';
import { makeTestQueryClient } from '@/shared/test/renderWithProviders';
import { setupMswServer } from '@/shared/test/setup-msw';
import { mswServer } from '@/shared/test/msw/server';
import { RoomDetailsPage } from './RoomDetailsPage';

setupMswServer();

const tomorrow = addDaysISO(todayISODate('Europe/Moscow'), 1);

function renderAt(path: string) {
  const router = createMemoryRouter([{ path: '/rooms/:roomId', element: <RoomDetailsPage /> }], {
    initialEntries: [path],
  });
  return render(
    <QueryClientProvider client={makeTestQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('RoomDetailsPage', () => {
  it('показывает детали комнаты и оснащение', async () => {
    renderAt('/rooms/room-everest');

    expect(await screen.findByRole('heading', { name: 'Эверест' })).toBeInTheDocument();
    expect(screen.getByText('Вместимость: до 12 человек')).toBeInTheDocument();
    expect(screen.getByText('Проектор и ТВ-панель 4К')).toBeInTheDocument();
    expect(screen.getByText('Офис Москва · Москва, ул. Лесная, 7')).toBeInTheDocument();
  });

  it('для неизвестной комнаты показывает страницу 404', async () => {
    renderAt('/rooms/room-unknown');
    expect(await screen.findByText('404')).toBeInTheDocument();
  });

  it('рисует расписание с бронями комнаты на выбранный день', async () => {
    // сид: у Эвереста есть бронь текущего пользователя завтра в 15:00
    renderAt(`/rooms/room-everest?date=${tomorrow}`);

    expect(await screen.findByText('Ежедневная встреча команды')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Забронировать комнату' })).toBeInTheDocument();
  });

  it('показывает ошибку расписания и предлагает повтор', async () => {
    mswServer.use(
      http.get(
        `${env.apiUrl}/api/v1/rooms/:roomId/bookings`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    renderAt('/rooms/room-everest');

    expect(
      await screen.findByRole('heading', { name: 'Не удалось загрузить расписание' }),
    ).toBeInTheDocument();
  });
});
