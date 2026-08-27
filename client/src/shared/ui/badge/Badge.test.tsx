import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('рендерит содержимое', () => {
    render(<Badge tone="available">Доступно</Badge>);
    expect(screen.getByText('Доступно')).toBeInTheDocument();
  });
});
