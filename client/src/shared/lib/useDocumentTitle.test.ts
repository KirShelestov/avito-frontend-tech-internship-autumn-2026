import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useDocumentTitle } from './useDocumentTitle';

describe('useDocumentTitle', () => {
  afterEach(() => {
    document.title = '';
  });

  it('добавляет суффикс « | BookRoom»', () => {
    renderHook(() => useDocumentTitle('Переговорные'));
    expect(document.title).toBe('Переговорные | BookRoom');
  });

  it('без заголовка оставляет только базовый', () => {
    renderHook(() => useDocumentTitle());
    expect(document.title).toBe('BookRoom');
  });

  it('обновляет заголовок при смене аргумента', () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: 'Эверест' },
    });
    expect(document.title).toBe('Эверест | BookRoom');
    rerender({ title: 'Казбек' });
    expect(document.title).toBe('Казбек | BookRoom');
  });
});
