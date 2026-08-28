import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from './Calendar';
import { DatePickerPopover } from './DatePickerPopover';

function CalendarHarness({ onChange }: { onChange?: (iso: string) => void }) {
  const [value, setValue] = useState('2026-10-15');
  return (
    <Calendar
      value={value}
      minDate="2026-10-10"
      maxDate="2026-10-25"
      onChange={(iso) => {
        setValue(iso);
        onChange?.(iso);
      }}
    />
  );
}

describe('Calendar', () => {
  it('показывает месяц выбранной даты', () => {
    render(<CalendarHarness />);
    expect(screen.getByText('Октябрь 2026')).toBeInTheDocument();
  });

  it('выбирает дату кликом', async () => {
    const onChange = vi.fn();
    render(<CalendarHarness onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: /^20 октября/ }));

    expect(onChange).toHaveBeenCalledWith('2026-10-20');
  });

  it('блокирует даты вне диапазона', () => {
    render(<CalendarHarness />);
    expect(screen.getByRole('button', { name: /^5 октября/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /^26 октября/ })).toBeDisabled();
  });

  it('не листает раньше месяца минимальной даты', () => {
    render(<CalendarHarness />);
    expect(screen.getByRole('button', { name: 'Предыдущий месяц' })).toBeDisabled();
  });
});

describe('DatePickerPopover', () => {
  it('показывает выбранную дату на триггере, календарь скрыт', () => {
    render(
      <DatePickerPopover
        value="2026-10-15"
        onChange={vi.fn()}
        minDate="2026-10-01"
        maxDate="2026-10-31"
      />,
    );

    expect(screen.getByRole('button', { name: /15 октября/i })).toBeInTheDocument();
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('показывает плейсхолдер, если дата не выбрана', () => {
    render(<DatePickerPopover value="" onChange={vi.fn()} placeholder="Выберите дату" />);
    expect(screen.getByRole('button', { name: 'Выберите дату' })).toBeInTheDocument();
  });
});
