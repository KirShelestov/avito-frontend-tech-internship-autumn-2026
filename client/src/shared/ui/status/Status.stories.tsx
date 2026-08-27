import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { CalendarX, Inbox } from 'lucide-react';
import { Button } from '../button';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';

const meta = {
  title: 'UI/Status',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Empty: Story = {
  render: () => (
    <EmptyState
      icon={<CalendarX size={40} strokeWidth={1.75} />}
      title="Нет бронирований"
      description="У вас пока нет предстоящих бронирований."
      action={<Button onClick={fn()}>Перейти к переговорным</Button>}
    />
  ),
};

export const EmptyNoAction: Story = {
  render: () => (
    <EmptyState
      icon={<Inbox size={40} strokeWidth={1.75} />}
      title="Нет доступных переговорных"
      description="Попробуйте изменить параметры фильтрации или выбрать другой офис."
    />
  ),
};

export const Error: Story = {
  render: () => (
    <ErrorState description="Произошла ошибка при загрузке списка переговорных" onRetry={fn()} />
  ),
};

export const ErrorNoRetry: Story = {
  render: () => <ErrorState description="Произошла ошибка при загрузке расписания переговорной" />,
};
