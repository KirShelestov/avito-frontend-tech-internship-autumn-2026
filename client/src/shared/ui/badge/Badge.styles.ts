import styled from '@emotion/styled';

export type BadgeTone = 'available' | 'busy' | 'neutral' | 'warning';

const toneStyles: Record<BadgeTone, string> = {
  available: `
    background-color: var(--color-available-bg);
    color: var(--color-available-text);
  `,
  busy: `
    background-color: var(--color-busy-bg);
    color: var(--color-busy-text);
  `,
  neutral: `
    background-color: var(--color-surface-muted);
    color: var(--color-text-muted);
  `,
  warning: `
    background-color: var(--color-warning-bg);
    color: var(--color-warning-text);
  `,
};

export const BadgeRoot = styled.span<{ $tone: BadgeTone; $block: boolean }>`
  display: ${(props) => (props.$block ? 'flex' : 'inline-flex')};
  align-items: center;
  gap: var(--space-2);
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 500;
  line-height: 1.2;
  ${(props) => toneStyles[props.$tone]}
`;

export const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
  flex-shrink: 0;
`;
