import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Banner } from './Banner';

describe('Banner', () => {
  it('объявляется через role=status и aria-live', () => {
    render(<Banner>Соединение потеряно. Переподключение…</Banner>);
    const banner = screen.getByRole('status');
    expect(banner).toHaveTextContent('Соединение потеряно. Переподключение…');
    expect(banner).toHaveAttribute('aria-live', 'polite');
  });

  it('можно убрать иконку', () => {
    const { container } = render(<Banner icon={null}>Текст</Banner>);
    expect(container.querySelector('svg')).toBeNull();
  });
});
