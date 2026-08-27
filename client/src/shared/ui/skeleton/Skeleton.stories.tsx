import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { width: 240, height: 16 },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Line: Story = {};

export const Title: Story = {
  args: { width: 160, height: 24 },
};

export const Avatar: Story = {
  args: { width: 40, height: 40, circle: true },
};
