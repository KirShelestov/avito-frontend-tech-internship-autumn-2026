import { bookViaApi, expect, futureDate, futureIso, resetBackend, test } from './fixtures';

test.beforeEach(async ({ request }) => {
  await resetBackend(request);
});

test('/ редиректит на /rooms и требует выбрать офис', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/rooms/);
  await expect(page.getByRole('heading', { name: 'Выберите офис' })).toBeVisible();
});

test('выбор офиса показывает список переговорных', async ({ page }) => {
  await page.goto('/rooms');
  await page.getByLabel('Выберите офис').selectOption({ label: 'Офис Москва' });

  await expect(page.getByRole('heading', { name: /Доступные переговорные/ })).toBeVisible();
  await expect(page.getByRole('article').first()).toBeVisible();
  await expect(page).toHaveURL(/office=office-moscow/);
});

test('фильтр вместимости сужает список, сброс возвращает', async ({ page }) => {
  await page.goto('/rooms?office=office-moscow');
  await expect(page.getByRole('heading', { name: /Доступные переговорные/ })).toBeVisible();
  const initialCount = await page.getByRole('article').count();

  await page.getByLabel('Вместимость').selectOption('12');
  await expect.poll(() => page.getByRole('article').count()).toBeLessThan(initialCount);

  await page.getByLabel('Вместимость').selectOption('');
  await expect.poll(() => page.getByRole('article').count()).toBe(initialCount);
});

test('открытие переговорной показывает расписание на день', async ({ page }) => {
  await page.goto('/rooms/room-everest');
  await expect(page.getByRole('heading', { name: 'Эверест' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Расписание на день' })).toBeVisible();
  await expect(page.getByText('09:00')).toBeVisible();
  await expect(page.getByText('20:00')).toBeVisible();
});

test('неизвестный маршрут показывает страницу 404', async ({ page }) => {
  await page.goto('/что-то-неизвестное');
  await expect(page.getByText('404')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Страница не найдена' })).toBeVisible();
  await page.getByRole('button', { name: 'Вернуться к переговорным' }).click();
  await expect(page).toHaveURL(/\/rooms/);
});

test('real-time: новая бронь появляется в открытом расписании без перезагрузки', async ({
  page,
  request,
}) => {
  const day = futureDate(2);
  await page.goto(`/rooms/room-altai?date=${day}`);
  await expect(page.getByRole('heading', { name: 'Алтай' })).toBeVisible();
  await expect(page.getByText('E2E: real-time слот')).toHaveCount(0);

  // Бэкенд не различает пользователей, поэтому бронь создаётся от текущего
  // и в расписании видна по своему заголовку.
  await bookViaApi(request, {
    roomId: 'room-altai',
    title: 'E2E: real-time слот',
    startsAt: futureIso(2, 14),
    endsAt: futureIso(2, 15),
  });

  // Без reload: WS-событие booking.created инвалидирует расписание комнаты.
  await expect(page.getByText('E2E: real-time слот')).toBeVisible({ timeout: 10_000 });
});
