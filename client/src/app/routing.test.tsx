import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { makeTestQueryClient } from '@/shared/test/renderWithProviders';
import { setupMswServer } from '@/shared/test/setup-msw';
import { routes } from './routes';

setupMswServer();

function renderApp(initialPath: string) {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });
  const queryClient = makeTestQueryClient();
  return {
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    ),
  };
}

describe('маршрутизация', () => {
  it('перенаправляет / на /rooms', async () => {
    renderApp('/');
    expect(await screen.findByRole('heading', { name: 'Переговорные' })).toBeInTheDocument();
  });

  it('открывает /bookings', async () => {
    renderApp('/bookings');
    expect(await screen.findByRole('heading', { name: 'Мои бронирования' })).toBeInTheDocument();
  });

  it('показывает страницу 404 для неизвестного пути', async () => {
    renderApp('/что-то-не-то');
    expect(await screen.findByText('404')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument();
  });

  it('в шапке есть имя пользователя из /me', async () => {
    renderApp('/rooms');
    expect(await screen.findByText('Константин К.')).toBeInTheDocument();
  });

  it('навигация по табам меняет маршрут', async () => {
    const { user } = renderApp('/rooms');
    await screen.findByRole('heading', { name: 'Переговорные' });

    await user.click(screen.getByRole('link', { name: 'Мои бронирования' }));

    expect(await screen.findByRole('heading', { name: 'Мои бронирования' })).toBeInTheDocument();
  });
});
