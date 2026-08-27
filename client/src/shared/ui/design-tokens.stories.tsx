import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Дизайн-система/Токены',
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'off' },
  },
};

export default meta;

type Story = StoryObj;

const COLORS = [
  '--color-brand-50',
  '--color-brand-100',
  '--color-brand-500',
  '--color-brand-600',
  '--color-brand-700',
  '--color-danger-100',
  '--color-danger-500',
  '--color-danger-600',
  '--color-text',
  '--color-text-muted',
  '--color-text-subtle',
  '--color-bg',
  '--color-surface',
  '--color-border',
  '--color-warning-bg',
  '--color-available-bg',
  '--color-busy-bg',
];

const SPACES = ['--space-1', '--space-2', '--space-3', '--space-4', '--space-6', '--space-8'];

const RADII = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-pill'];

const TEXT = ['--text-xs', '--text-sm', '--text-md', '--text-lg', '--text-xl', '--text-2xl'];

export const Overview: Story = {
  render: () => (
    <div
      style={{
        padding: 'var(--space-8)',
        display: 'grid',
        gap: 'var(--space-8)',
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-text)',
      }}
    >
      <section>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>Цвета</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 'var(--space-3)',
          }}
        >
          {COLORS.map((token) => (
            <div
              key={token}
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}
            >
              <div style={{ height: 56, background: `var(${token})` }} />
              <code style={{ display: 'block', padding: 'var(--space-2)', fontSize: 12 }}>
                {token}
              </code>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>Отступы</h2>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          {SPACES.map((token) => (
            <div
              key={token}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
            >
              <div
                style={{ width: `var(${token})`, height: 16, background: 'var(--color-brand-500)' }}
              />
              <code style={{ fontSize: 12 }}>{token}</code>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>Скругления</h2>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          {RADII.map((token) => (
            <div key={token} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  background: 'var(--color-brand-100)',
                  border: '1px solid var(--color-brand-500)',
                  borderRadius: `var(${token})`,
                }}
              />
              <code style={{ fontSize: 12 }}>{token}</code>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>Типографика</h2>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          {TEXT.map((token) => (
            <div key={token} style={{ fontSize: `var(${token})` }}>
              {token}: Съешь ещё этих мягких французских булок
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
