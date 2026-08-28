import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ToastProvider } from './ToastProvider';
import { useToast } from './toast-context';

function Trigger() {
  const { toast } = useToast();
  return (
    <button
      type="button"
      onClick={() =>
        toast({
          tone: 'success',
          title: 'Бронирование создано',
          description: 'Эверест',
          duration: 100_000,
        })
      }
    >
      Показать
    </button>
  );
}

function setup() {
  return render(
    <ToastProvider>
      <Trigger />
    </ToastProvider>,
  );
}

describe('Toast', () => {
  it('показывает тост по вызову useToast().toast', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Показать' }));

    expect(await screen.findByText('Бронирование создано')).toBeInTheDocument();
    expect(screen.getByText('Эверест')).toBeInTheDocument();
  });

  it('закрывает тост по кнопке закрытия', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Показать' }));
    await screen.findByText('Бронирование создано');

    await userEvent.click(screen.getByRole('button', { name: 'Закрыть' }));

    expect(screen.queryByText('Бронирование создано')).not.toBeInTheDocument();
  });
});
