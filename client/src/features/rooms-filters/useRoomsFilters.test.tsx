import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import type { Office } from '@/shared/api';
import { useRoomsFilters } from './useRoomsFilters';

const offices: Office[] = [
  { id: 'office-moscow', name: 'Москва', address: 'ул. Лесная, 7', timezone: 'Europe/Moscow' },
];

const wrapperAt = (path: string) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>;
  };

describe('useRoomsFilters', () => {
  it('без офиса не считает интервал', () => {
    const { result } = renderHook(() => useRoomsFilters(offices), {
      wrapper: wrapperAt('/rooms'),
    });
    expect(result.current.filters.officeId).toBeNull();
    expect(result.current.from).toBeUndefined();
    expect(result.current.to).toBeUndefined();
  });

  it('считает from/to из даты, времени и длительности в зоне офиса', () => {
    const { result } = renderHook(() => useRoomsFilters(offices), {
      wrapper: wrapperAt('/rooms?office=office-moscow&date=2026-08-19&start=13:00&duration=90'),
    });

    expect(result.current.from).toBe('2026-08-19T13:00:00+03:00');
    expect(result.current.to).toBe('2026-08-19T14:30:00+03:00');
    expect(result.current.timezone).toBe('Europe/Moscow');
  });

  it('setCapacity пишет и очищает параметр', () => {
    const { result } = renderHook(() => useRoomsFilters(offices), {
      wrapper: wrapperAt('/rooms?office=office-moscow'),
    });

    act(() => {
      result.current.setCapacity(8);
    });
    expect(result.current.filters.capacity).toBe(8);

    act(() => {
      result.current.setCapacity(null);
    });
    expect(result.current.filters.capacity).toBeNull();
  });

  it('reset очищает фильтры, но оставляет офис', () => {
    const { result } = renderHook(() => useRoomsFilters(offices), {
      wrapper: wrapperAt('/rooms?office=office-moscow&capacity=8&duration=120'),
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.filters.officeId).toBe('office-moscow');
    expect(result.current.filters.capacity).toBeNull();
    expect(result.current.filters.duration).toBe(60);
  });
});
