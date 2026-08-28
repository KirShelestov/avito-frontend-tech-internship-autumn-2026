import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { addDaysISO, MAX_ADVANCE_DAYS, todayISODate } from '@/shared/lib/date';
import { Calendar } from './Calendar';
import { DatePickerPopover } from './DatePickerPopover';

const meta = {
  title: 'UI/Calendar',
  component: Calendar,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj;

const today = todayISODate();
const maxDate = addDaysISO(today, MAX_ADVANCE_DAYS);

export const Inline: Story = {
  render: () => {
    const [value, setValue] = useState(today);
    return <Calendar value={value} onChange={setValue} minDate={today} maxDate={maxDate} />;
  },
};

export const Popover: Story = {
  render: () => {
    const [value, setValue] = useState(today);
    return (
      <DatePickerPopover value={value} onChange={setValue} minDate={today} maxDate={maxDate} />
    );
  },
};
