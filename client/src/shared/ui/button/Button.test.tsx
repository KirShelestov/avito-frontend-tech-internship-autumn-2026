import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('вызывает onClick по клику', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Ок</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Ок' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('по умолчанию имеет type="button"', () => {
    render(<Button>Ок</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('в состоянии loading заблокирована и не кликается', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Ок
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Ок' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('пробрасывает disabled', () => {
    render(<Button disabled>Ок</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
