import type { Meta, StoryObj } from '@storybook/react';
import { Banner } from './Banner';

const meta = {
  title: 'UI/Banner',
  component: Banner,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { children: 'Соединение потеряно. Переподключение…', tone: 'warning' },
} satisfies Meta<typeof Banner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Reconnecting: Story = {};

export const Info: Story = {
  args: { tone: 'info', children: 'Данные обновлены' },
};

export const Danger: Story = {
  args: { tone: 'danger', children: 'Не удалось синхронизировать расписание' },
};
