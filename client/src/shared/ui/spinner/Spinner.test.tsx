import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('имеет роль status и подпись по умолчанию', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAccessibleName('Загрузка…');
  });

  it('принимает свою подпись', () => {
    render(<Spinner label="Отменяем" />);
    expect(screen.getByRole('status')).toHaveAccessibleName('Отменяем');
  });
});
