import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { children: 'Доступно на выбранное время', tone: 'available', dot: true },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Available: Story = {};

export const Busy: Story = {
  args: { tone: 'busy', children: 'Недоступно на выбранное время' },
};

export const Warning: Story = {
  args: { tone: 'warning', children: 'Соединение потеряно' },
};

export const Block: Story = {
  args: { block: true },
};
