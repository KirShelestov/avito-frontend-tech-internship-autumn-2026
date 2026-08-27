import type { Meta, StoryObj } from '@storybook/react';
import {
  ColorCard,
  ColorGrid,
  ColorSwatch,
  Page,
  RadiiBox,
  RadiiItem,
  RadiiRow,
  SectionTitle,
  SpaceBar,
  SpaceRow,
  Stack,
  TextSample,
  TokenCode,
} from './design-tokens.styles';

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
    <Page>
      <section>
        <SectionTitle>Цвета</SectionTitle>
        <ColorGrid>
          {COLORS.map((token) => (
            <ColorCard key={token}>
              <ColorSwatch token={token} />
              <TokenCode>{token}</TokenCode>
            </ColorCard>
          ))}
        </ColorGrid>
      </section>

      <section>
        <SectionTitle>Отступы</SectionTitle>
        <Stack>
          {SPACES.map((token) => (
            <SpaceRow key={token}>
              <SpaceBar token={token} />
              <TokenCode>{token}</TokenCode>
            </SpaceRow>
          ))}
        </Stack>
      </section>

      <section>
        <SectionTitle>Скругления</SectionTitle>
        <RadiiRow>
          {RADII.map((token) => (
            <RadiiItem key={token}>
              <RadiiBox token={token} />
              <TokenCode>{token}</TokenCode>
            </RadiiItem>
          ))}
        </RadiiRow>
      </section>

      <section>
        <SectionTitle>Типографика</SectionTitle>
        <Stack>
          {TEXT.map((token) => (
            <TextSample key={token} token={token}>
              {token}: Съешь ещё этих мягких французских булок
            </TextSample>
          ))}
        </Stack>
      </section>
    </Page>
  ),
};
