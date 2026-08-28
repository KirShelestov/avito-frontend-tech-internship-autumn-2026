import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TimeField } from './TimeField';

function Harness({ onChange, initial = '' }: { onChange?: (v: string) => void; initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <TimeField
      label="Время начала"
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

describe('TimeField', () => {
  it('маскирует ввод цифр в формат HH:MM', async () => {
    render(<Harness />);
    const input = screen.getByLabelText('Время начала');

    await userEvent.type(input, '0930');

    expect(input).toHaveValue('09:30');
  });

  it('по потере фокуса привязывает к шагу 15 минут', async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const input = screen.getByLabelText('Время начала');

    await userEvent.type(input, '0907');
    await userEvent.tab();

    expect(input).toHaveValue('09:00');
    expect(onChange).toHaveBeenLastCalledWith('09:00');
  });

  it('стрелки меняют время на шаг', async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} initial="09:00" />);
    const input = screen.getByLabelText('Время начала');

    input.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith('09:15');

    await userEvent.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith('09:00');
  });

  it('зажимает в рабочие часы', async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const input = screen.getByLabelText('Время начала');

    await userEvent.type(input, '2300');
    await userEvent.tab();

    expect(input).toHaveValue('19:45');
  });
});
