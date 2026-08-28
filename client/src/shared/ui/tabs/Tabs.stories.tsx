import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs } from './Tabs';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('upcoming');
    return (
      <Tabs
        tabs={[
          { value: 'upcoming', label: 'Предстоящие (2)' },
          { value: 'past', label: 'Прошедшие' },
        ]}
        value={value}
        onValueChange={setValue}
        aria-label="Фильтр бронирований"
      >
        {value === 'upcoming' ? 'Список предстоящих бронирований' : 'Список прошедших бронирований'}
      </Tabs>
    );
  },
};
