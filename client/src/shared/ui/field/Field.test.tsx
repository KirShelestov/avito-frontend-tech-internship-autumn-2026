import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';
import { Textarea } from './Textarea';

describe('Input', () => {
  it('связывает подпись с полем', () => {
    render(<Input label="Тема встречи" />);
    expect(screen.getByLabelText('Тема встречи')).toBeInstanceOf(HTMLInputElement);
  });

  it('показывает ошибку через role=alert и aria-invalid', () => {
    render(<Input label="Тема" error="Обязательное поле" />);
    const input = screen.getByLabelText('Тема');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Обязательное поле');
    expect(input).toHaveAccessibleDescription('Обязательное поле');
  });

  it('при наличии ошибки подсказка скрывается', () => {
    render(<Input label="Тема" hint="Подсказка" error="Ошибка" />);
    expect(screen.queryByText('Подсказка')).not.toBeInTheDocument();
  });

  it('подставляет подсказку в описание', () => {
    render(<Input label="Тема" hint="Название увидят участники" />);
    expect(screen.getByLabelText('Тема')).toHaveAccessibleDescription('Название увидят участники');
  });
});

describe('Textarea', () => {
  it('связывает подпись с полем', () => {
    render(<Textarea label="Комментарий" />);
    expect(screen.getByLabelText('Комментарий')).toBeInstanceOf(HTMLTextAreaElement);
  });
});
