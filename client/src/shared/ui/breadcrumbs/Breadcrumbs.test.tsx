import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  const items = [
    { label: 'Переговорные', href: '/rooms' },
    { label: 'Офис Москва', href: '/rooms?office=office-moscow' },
    { label: 'Комната «Эверест»' },
  ];

  it('делает последний элемент текущей страницей без ссылки', () => {
    render(<Breadcrumbs items={items} />);
    const current = screen.getByText('Комната «Эверест»');
    expect(current.closest('a')).toBeNull();
    expect(current.closest('li')).toHaveAttribute('aria-current', 'page');
  });

  it('рендерит ссылки для промежуточных элементов', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByRole('link', { name: 'Переговорные' })).toHaveAttribute('href', '/rooms');
  });

  it('имеет доступное имя навигации', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByRole('navigation', { name: 'Навигационная цепочка' })).toBeInTheDocument();
  });
});
