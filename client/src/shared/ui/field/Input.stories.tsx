import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    label: 'Тема встречи',
    placeholder: 'Укажите тему встречи',
    fullWidth: true,
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const WithHint: Story = {
  args: { hint: 'Название увидят участники встречи' },
};

export const WithError: Story = {
  args: { required: true, error: 'Обязательное поле' },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Недоступно' },
};
