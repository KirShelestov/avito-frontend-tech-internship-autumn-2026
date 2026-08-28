import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Row } from '../story-helpers.styles';
import { ToastProvider } from './ToastProvider';
import { useToast } from './toast-context';

const meta = {
  title: 'UI/Toast',
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
} satisfies Meta;

export default meta;

type Story = StoryObj;

function Demo() {
  const { toast } = useToast();
  return (
    <Row>
      <Button
        onClick={() =>
          toast({
            tone: 'success',
            title: 'Бронирование создано',
            description: 'Комната Эверест, 24 октября, 15:00–16:00 MSK',
          })
        }
      >
        Успех
      </Button>
      <Button
        variant="danger"
        onClick={() => toast({ tone: 'error', title: 'Не удалось отменить бронирование' })}
      >
        Ошибка
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ tone: 'info', title: 'Данные обновлены' })}
      >
        Инфо
      </Button>
    </Row>
  );
}

export const Playground: Story = {
  render: () => <Demo />,
};
