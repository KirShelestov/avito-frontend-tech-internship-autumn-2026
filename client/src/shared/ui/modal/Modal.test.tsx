import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

function ControlledModal({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(true);
  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        onOpenChange?.(next);
      }}
      title="Новое бронирование"
      description="Переговорная: Эверест"
    >
      <p>Тело</p>
    </Modal>
  );
}

describe('Modal', () => {
  it('рендерит заголовок и описание в роли dialog', () => {
    render(<ControlledModal />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName('Новое бронирование');
    expect(dialog).toHaveTextContent('Переговорная: Эверест');
  });

  it('закрывается по Escape', async () => {
    const onOpenChange = vi.fn();
    render(<ControlledModal onOpenChange={onOpenChange} />);

    await userEvent.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('закрывается по кнопке-крестику', async () => {
    render(<ControlledModal />);
    await userEvent.click(screen.getByRole('button', { name: 'Закрыть' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
