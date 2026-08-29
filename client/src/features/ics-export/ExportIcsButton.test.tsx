import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BookingView } from '@/shared/api';
import { ExportIcsButton } from './ExportIcsButton';

const booking = {
  id: 'b1',
  title: 'Планёрка',
  startsAt: '2026-10-24T15:00:00+03:00',
  endsAt: '2026-10-24T16:00:00+03:00',
  comment: null,
  room: { name: 'Эверест', floor: 4 },
  office: { name: 'Офис Москва', timezone: 'Europe/Moscow' },
} as BookingView;

describe('ExportIcsButton', () => {
  let clickSpy: ReturnType<typeof vi.spyOn>;
  let lastDownload = '';

  beforeEach(() => {
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: vi.fn(() => 'blob:mock'),
      revokeObjectURL: vi.fn(),
    });
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      lastDownload = this.download;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clickSpy.mockRestore();
    lastDownload = '';
  });

  it('скачивает .ics с именем по теме брони', async () => {
    render(<ExportIcsButton bookings={[booking]} />);

    await userEvent.click(screen.getByRole('button', { name: /Планёрка/ }));

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(lastDownload).toBe('планёрка.ics');
  });

  it('в режиме bulk скачивает общий файл', async () => {
    render(<ExportIcsButton bookings={[booking, { ...booking, id: 'b2' }]} bulk />);

    await userEvent.click(screen.getByRole('button', { name: 'Скачать всё (.ics)' }));

    expect(lastDownload).toBe('бронирования.ics');
  });

  it('пустой список не рендерит кнопку', () => {
    render(<ExportIcsButton bookings={[]} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
