import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { env } from '@/shared/config/env';
import { makeTestQueryClient } from '@/shared/test/renderWithProviders';
import { ToastProvider } from '@/shared/ui/toast';
import { setupMswServer } from '@/shared/test/setup-msw';
import { mswServer } from '@/shared/test/msw/server';
import { BookingsPage } from './BookingsPage';

setupMswServer();

function renderPage(path = '/bookings') {
  const router = createMemoryRouter(
    [
      { path: '/bookings', element: <BookingsPage /> },
      { path: '/rooms', element: <div>Экран переговорных</div> },
    ],
    { initialEntries: [path] },
  );
  return {
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={makeTestQueryClient()}>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </QueryClientProvider>,
    ),
  };
}

describe('BookingsPage', () => {
  it('показывает предстоящие брони и счётчик во вкладке', async () => {
    renderPage();
    expect(await screen.findByRole('tab', { name: 'Предстоящие (2)' })).toBeInTheDocument();
    expect(await screen.findByText('Ежедневная встреча команды')).toBeInTheDocument();
  });

  it('вкладка «Прошедшие» переключает список и убирает кнопки отмены', async () => {
    const { user } = renderPage();
    await screen.findByText('Ежедневная встреча команды');

    await user.click(screen.getByRole('tab', { name: 'Прошедшие' }));

    expect(await screen.findByText('Ретроспектива команды')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Отменить' })).not.toBeInTheDocument();
  });

  it('отменяет бронь через подтверждение', async () => {
    const { user } = renderPage();
    const card = (await screen.findAllByRole('article')).find((el) =>
      within(el).queryByText('Ежедневная встреча команды'),
    )!;

    await user.click(within(card).getByRole('button', { name: 'Отменить' }));

    const dialog = await screen.findByRole('dialog', { name: 'Отменить бронирование?' });
    await user.click(within(dialog).getByRole('button', { name: 'Да, отменить' }));

    expect(await screen.findByText('Бронирование отменено')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Ежедневная встреча команды')).not.toBeInTheDocument();
    });
  });

  it('фильтр офиса запрашивает брони конкретного офиса', async () => {
    const { user } = renderPage();
    await screen.findByText('Ежедневная встреча команды');

    await user.selectOptions(screen.getByLabelText('Все офисы'), 'office-saint-petersburg');

    expect(await screen.findByText('Нет бронирований')).toBeInTheDocument();
  });

  it('показывает ошибку и повторяет запрос', async () => {
    mswServer.use(
      http.get(`${env.apiUrl}/api/v1/bookings`, () => new HttpResponse(null, { status: 500 }), {
        once: true,
      }),
    );
    const { user } = renderPage();

    const retry = await screen.findByRole('button', { name: 'Попробовать снова' });
    await user.click(retry);

    expect(await screen.findByText('Ежедневная встреча команды')).toBeInTheDocument();
  });
});
