import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { env } from '@/shared/config/env';
import { makeTestQueryClient } from '@/shared/test/renderWithProviders';
import { setupMswServer } from '@/shared/test/setup-msw';
import { mswServer } from '@/shared/test/msw/server';
import { RoomsPage } from './RoomsPage';

setupMswServer();

function renderRoomsPage(initialPath = '/rooms') {
  const router = createMemoryRouter([{ path: '/rooms', element: <RoomsPage /> }], {
    initialEntries: [initialPath],
  });
  return {
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={makeTestQueryClient()}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    ),
  };
}

describe('RoomsPage', () => {
  it('без выбранного офиса просит выбрать офис и не грузит список', async () => {
    renderRoomsPage();
    expect(await screen.findByRole('heading', { name: 'Выберите офис' })).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('после выбора офиса показывает список комнат', async () => {
    const { user } = renderRoomsPage();
    await screen.findByRole('heading', { name: 'Выберите офис' });
    await screen.findByRole('option', { name: 'Офис Москва' });

    await user.selectOptions(screen.getByLabelText('Выберите офис'), 'office-moscow');

    expect(
      await screen.findByRole('heading', { name: /Доступные переговорные/ }),
    ).toBeInTheDocument();
    const cards = await screen.findAllByRole('article');
    expect(cards.length).toBeGreaterThan(0);
    expect(within(cards[0]!).getByRole('heading')).toBeInTheDocument();
  });

  it('фильтр вместимости сужает список', async () => {
    const { user } = renderRoomsPage('/rooms?office=office-moscow');
    await screen.findByRole('heading', { name: /Доступные переговорные/ });
    const initial = (await screen.findAllByRole('article')).length;

    await user.selectOptions(screen.getByLabelText('Вместимость'), '12');

    await screen.findByRole('heading', { name: /Доступные переговорные/ });
    const filtered = screen.getAllByRole('article');
    expect(filtered.length).toBeLessThan(initial);
  });

  it('показывает состояние ошибки и повторяет запрос', async () => {
    mswServer.use(
      http.get(`${env.apiUrl}/api/v1/rooms`, () => new HttpResponse(null, { status: 500 }), {
        once: true,
      }),
    );

    const { user } = renderRoomsPage('/rooms?office=office-moscow');

    const retry = await screen.findByRole('button', { name: 'Попробовать снова' });
    await user.click(retry);

    expect(
      await screen.findByRole('heading', { name: /Доступные переговорные/ }),
    ).toBeInTheDocument();
  });

  it('пустой результат предлагает сбросить фильтры', async () => {
    mswServer.use(http.get(`${env.apiUrl}/api/v1/rooms`, () => HttpResponse.json({ items: [] })));

    renderRoomsPage('/rooms?office=office-moscow');

    expect(await screen.findByText('Нет доступных переговорных')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Сбросить фильтры' })).toBeInTheDocument();
  });
});
