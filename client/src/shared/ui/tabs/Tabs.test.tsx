import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Tabs } from './Tabs';

function ControlledTabs() {
  const [value, setValue] = useState('upcoming');
  return (
    <Tabs
      tabs={[
        { value: 'upcoming', label: 'Предстоящие' },
        { value: 'past', label: 'Прошедшие' },
      ]}
      value={value}
      onValueChange={setValue}
      aria-label="Фильтр"
    >
      {value === 'upcoming' ? 'Предстоящие брони' : 'Прошедшие брони'}
    </Tabs>
  );
}

describe('Tabs', () => {
  it('переключает активную вкладку и контент', async () => {
    render(<ControlledTabs />);

    expect(screen.getByText('Предстоящие брони')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: 'Прошедшие' }));

    expect(screen.getByRole('tab', { name: 'Прошедшие' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Прошедшие брони')).toBeInTheDocument();
  });
});
