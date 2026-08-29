import styled from '@emotion/styled';

export type StatusTone = 'neutral' | 'muted' | 'danger';

const toneColors: Record<StatusTone, { fg: string; bg: string }> = {
  neutral: { fg: 'var(--color-brand-600)', bg: 'var(--color-brand-100)' },
  muted: { fg: 'var(--color-text-muted)', bg: 'var(--color-busy-bg)' },
  danger: { fg: 'var(--color-danger-500)', bg: 'var(--color-danger-100)' },
};

export const StatusRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-2);
  padding: var(--space-10) var(--space-4);
`;

export const IconCircle = styled.div<{ $tone: StatusTone }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: var(--space-4);
  color: ${(props) => toneColors[props.$tone].fg};
  background-color: ${(props) => toneColors[props.$tone].bg};
`;

export const StatusTitle = styled.h2`
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text);
`;

export const StatusText = styled.p`
  max-width: 48ch;
  font-size: var(--text-base);
  color: var(--color-text-muted);
`;

export const StatusActions = styled.div`
  margin-top: var(--space-4);
`;
