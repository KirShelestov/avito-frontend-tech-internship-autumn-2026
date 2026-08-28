import styled from '@emotion/styled';

export type BannerTone = 'warning' | 'danger' | 'info';

const toneStyles: Record<BannerTone, string> = {
  warning: `
    background-color: var(--color-warning-bg);
    color: var(--color-warning-text);
  `,
  danger: `
    background-color: var(--color-danger-100);
    color: var(--color-danger-600);
  `,
  info: `
    background-color: var(--color-brand-50);
    color: var(--color-brand-700);
  `,
};

export const BannerRoot = styled.div<{ $tone: BannerTone }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  font-weight: 500;
  text-align: center;
  ${(props) => toneStyles[props.$tone]}
`;

export const IconWrap = styled.span`
  display: inline-flex;
  flex-shrink: 0;
`;
