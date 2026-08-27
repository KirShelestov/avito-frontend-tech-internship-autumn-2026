import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('скрыт от скринридеров', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('переводит числовые размеры в пиксели', () => {
    const { container } = render(<Skeleton width={120} height={12} />);
    expect(container.firstChild).toHaveStyle({ width: '120px', height: '12px' });
  });
});
