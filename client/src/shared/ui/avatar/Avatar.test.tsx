import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('вычисляет инициалы из имени', () => {
    render(<Avatar name="Константин Кузнецов" />);
    expect(screen.getByText('КК')).toBeInTheDocument();
  });

  it('использует переданные инициалы', () => {
    render(<Avatar name="Анна Смирнова" initials="АС" />);
    expect(screen.getByText('АС')).toBeInTheDocument();
  });

  it('показывает изображение, если задан src', () => {
    render(<Avatar name="Анна" src="https://example.test/a.png" />);
    expect(screen.getByRole('img', { name: 'Анна' })).toBeInTheDocument();
  });
});
