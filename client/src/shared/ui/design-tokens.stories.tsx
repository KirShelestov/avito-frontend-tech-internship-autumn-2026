import styled from '@emotion/styled';
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

const Page = styled.div`
  padding: var(--space-8);
  display: grid;
  gap: var(--space-8);
  font-family: var(--font-sans);
  color: var(--color-text);
`;

const SectionTitle = styled.h2`
  margin-bottom: var(--space-4);
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--space-3);
`;

const ColorCard = styled.div`
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
`;

const ColorSwatch = styled.div<{ token: string }>`
  height: 56px;
  background: var(${(props) => props.token});
`;

const TokenCode = styled.code`
  display: block;
  padding: var(--space-2);
  font-size: 12px;
`;

const Stack = styled.div`
  display: grid;
  gap: var(--space-2);
`;

const SpaceRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const SpaceBar = styled.div<{ token: string }>`
  width: var(${(props) => props.token});
  height: 16px;
  background: var(--color-brand-500);
`;

const RadiiRow = styled.div`
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
`;

const RadiiItem = styled.div`
  text-align: center;
`;

const RadiiBox = styled.div<{ token: string }>`
  width: 72px;
  height: 72px;
  background: var(--color-brand-100);
  border: 1px solid var(--color-brand-500);
  border-radius: var(${(props) => props.token});
`;

const TextSample = styled.div<{ token: string }>`
  font-size: var(${(props) => props.token});
`;

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
