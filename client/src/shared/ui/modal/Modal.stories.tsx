import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { Input } from '../field';
import { Modal } from './Modal';

const meta = {
  title: 'UI/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj;

export const FormModal: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Новое бронирование</Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Новое бронирование"
          description="Переговорная: Эверест (Офис Москва, 4 этаж)"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button onClick={() => setOpen(false)}>Забронировать</Button>
            </>
          }
        >
          <Input label="Тема встречи" required placeholder="Укажите тему встречи" fullWidth />
        </Modal>
      </>
    );
  },
};

export const ConfirmModal: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Отменить бронирование
        </Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          size="sm"
          hideCloseButton
          title="Отменить бронирование?"
          description="Это действие нельзя будет отменить. Освободившееся время станет доступно другим сотрудникам."
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Нет, оставить
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Да, отменить
              </Button>
            </>
          }
        />
      </>
    );
  },
};
