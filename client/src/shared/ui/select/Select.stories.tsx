import type { Meta, StoryObj } from '@storybook/react';
import { Users } from 'lucide-react';
import { Select } from './Select';

const meta = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    label: 'Длительность',
    options: [
      { value: '15', label: '15 мин' },
      { value: '30', label: '30 мин' },
      { value: '60', label: '1 час' },
      { value: '120', label: '2 часа' },
    ],
    defaultValue: '60',
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLeftIcon: Story = {
  args: {
    label: 'Вместимость',
    leftIcon: <Users size={16} />,
    options: [
      { value: '2', label: 'Мин. 2 чел.' },
      { value: '4', label: 'Мин. 4 чел.' },
      { value: '8', label: 'Мин. 8 чел.' },
    ],
    defaultValue: '4',
  },
};

export const WithPlaceholder: Story = {
  args: { label: 'Офис', placeholder: 'Выберите офис', defaultValue: '' },
};

export const WithError: Story = {
  args: { error: 'Выберите значение' },
};
