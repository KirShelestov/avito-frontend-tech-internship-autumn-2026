import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TimeField } from './TimeField';

const meta = {
  title: 'UI/TimeField',
  component: TimeField,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TimeField>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('15:00');
    return (
      <TimeField
        label="Время начала"
        value={value}
        onChange={setValue}
        hint="Шаг 15 минут, рабочие часы 09:00–20:00"
      />
    );
  },
};

export const Empty: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return <TimeField label="Время начала" value={value} onChange={setValue} />;
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('09:07');
    return (
      <TimeField
        label="Время начала"
        value={value}
        onChange={setValue}
        error="Время должно быть кратно 15 минутам"
      />
    );
  },
};
