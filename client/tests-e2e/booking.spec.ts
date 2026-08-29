import { bookViaApi, expect, futureDate, futureIso, resetBackend, test } from './fixtures';

test.beforeEach(async ({ request }) => {
  await resetBackend(request);
});

test('создание брони: тост об успехе и появление в «Моих бронированиях»', async ({ page }) => {
  const day = futureDate(1);
  await page.goto(`/rooms/room-elbrus?date=${day}`);

  await page.getByRole('button', { name: 'Забронировать комнату' }).click();
  const dialog = page.getByRole('dialog', { name: 'Новое бронирование' });
  await expect(dialog).toBeVisible();

  await dialog.getByLabel(/Тема встречи/).fill('E2E: обсуждение плана');
  // 12:00 свободно: сид занимает Эльбрус на завтра только с 10:00 до 11:30
  await dialog.getByLabel('Время начала').fill('12:00');
  await dialog.getByLabel('Время начала').blur();
  await dialog.getByRole('button', { name: 'Забронировать' }).click();

  await expect(page.getByText('Бронирование создано')).toBeVisible();

  await page.getByRole('link', { name: 'Мои бронирования' }).click();
  await expect(page.getByText('E2E: обсуждение плана')).toBeVisible();
});

test('отмена брони: подтверждение, тост, отсутствие после перезагрузки', async ({ page }) => {
  await page.goto('/bookings');
  const card = page.getByRole('article').filter({ hasText: 'Ежедневная встреча команды' });
  await expect(card).toBeVisible();

  await card.getByRole('button', { name: 'Отменить' }).click();
  const confirm = page.getByRole('dialog', { name: 'Отменить бронирование?' });
  await confirm.getByRole('button', { name: 'Да, отменить' }).click();

  await expect(page.getByText('Бронирование отменено')).toBeVisible();
  await expect(page.getByText('Ежедневная встреча команды')).toHaveCount(0);

  await page.reload();
  await expect(page.getByText('Ежедневная встреча команды')).toHaveCount(0);
});

test('конфликт 409: модалка «Время уже занято» и возврат к форме', async ({ page, request }) => {
  const day = futureDate(1);
  await bookViaApi(request, {
    roomId: 'room-kazbek',
    title: 'Занятый слот',
    startsAt: futureIso(1, 11),
    endsAt: futureIso(1, 12),
  });

  await page.goto(`/rooms/room-kazbek?date=${day}`);
  await page.getByRole('button', { name: 'Забронировать комнату' }).click();
  const dialog = page.getByRole('dialog', { name: 'Новое бронирование' });

  await dialog.getByLabel(/Тема встречи/).fill('E2E: конфликт');
  await dialog.getByLabel('Время начала').fill('11:00');
  await dialog.getByLabel('Время начала').blur();
  await dialog.getByRole('button', { name: 'Забронировать' }).click();

  await expect(page.getByRole('dialog', { name: 'Время уже занято' })).toBeVisible();
  await page.getByRole('button', { name: 'Выбрать другое время' }).click();
  await expect(page.getByLabel(/Тема встречи/)).toBeVisible();
});
