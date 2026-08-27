import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { name: 'Константин Кузнецов' },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Initials: Story = {};

export const CustomInitials: Story = {
  args: { name: 'Анна Смирнова', initials: 'АС' },
};

export const Large: Story = {
  args: { size: 64 },
};
