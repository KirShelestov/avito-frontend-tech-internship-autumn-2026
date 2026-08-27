import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalendarX } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('показывает заголовок по умолчанию', () => {
    render(<ErrorState />);
    expect(
      screen.getByRole('heading', { name: 'Не удалось загрузить данные' }),
    ).toBeInTheDocument();
  });

  it('вызывает onRetry по кнопке «Попробовать снова»', async () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    await userEvent.click(screen.getByRole('button', { name: 'Попробовать снова' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('без onRetry не показывает кнопку', () => {
    render(<ErrorState />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('рендерит заголовок, описание и действие', () => {
    render(
      <EmptyState
        icon={<CalendarX />}
        title="Нет бронирований"
        description="Пусто"
        action={<button type="button">Создать</button>}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Нет бронирований' })).toBeInTheDocument();
    expect(screen.getByText('Пусто')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Создать' })).toBeInTheDocument();
  });
});
