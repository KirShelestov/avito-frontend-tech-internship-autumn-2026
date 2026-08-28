import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const options = [
  { value: '15', label: '15 мин' },
  { value: '60', label: '1 час' },
];

describe('Select', () => {
  it('связывает подпись с полем и меняет значение', async () => {
    const onChange = vi.fn();
    render(<Select label="Длительность" options={options} defaultValue="15" onChange={onChange} />);

    const select = screen.getByLabelText('Длительность');
    await userEvent.selectOptions(select, '60');

    expect(select).toHaveValue('60');
    expect(onChange).toHaveBeenCalled();
  });

  it('рендерит плейсхолдер как выключенную опцию', () => {
    render(<Select label="Офис" options={options} placeholder="Выберите офис" defaultValue="" />);
    const placeholder = screen.getByRole('option', { name: 'Выберите офис' });
    expect(placeholder).toBeDisabled();
  });

  it('показывает ошибку и проставляет aria-invalid', () => {
    render(<Select label="Офис" options={options} error="Выберите значение" />);
    expect(screen.getByLabelText('Офис')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Выберите значение');
  });
});
