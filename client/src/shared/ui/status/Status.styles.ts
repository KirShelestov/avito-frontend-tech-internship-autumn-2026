import styled from '@emotion/styled';

export type StatusTone = 'neutral' | 'danger';

export const StatusRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-3);
  padding: var(--space-10) var(--space-4);
`;

export const IconCircle = styled.div<{ $tone: StatusTone }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  margin-bottom: var(--space-2);
  color: ${(props) =>
    props.$tone === 'danger' ? 'var(--color-danger-600)' : 'var(--color-brand-600)'};
  background-color: ${(props) =>
    props.$tone === 'danger' ? 'var(--color-danger-100)' : 'var(--color-brand-100)'};
`;

export const StatusTitle = styled.h2`
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
`;

export const StatusText = styled.p`
  max-width: 42ch;
  color: var(--color-text-muted);
`;

export const StatusActions = styled.div`
  margin-top: var(--space-3);
`;
