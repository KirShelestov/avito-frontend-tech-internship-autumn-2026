import styled from '@emotion/styled';

export const Form = styled.form`
  display: grid;
  gap: var(--space-5);
`;

export const TwoCols = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldBlock = styled.div`
  display: grid;
  gap: var(--space-2);
  align-content: start;
`;

export const FieldCaption = styled.span`
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
`;

export const FieldError = styled.span`
  margin-top: calc(-1 * var(--space-1));
  font-size: var(--text-xs);
  color: var(--color-danger-500);
`;

export const Subtitle = styled.span`
  b {
    font-weight: 600;
    color: var(--color-brand-600);
  }
`;

export const SeriesResult = styled.div`
  display: grid;
  gap: var(--space-2);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background-color: var(--color-surface-muted);
`;

export const SeriesLine = styled.p<{ $tone?: 'ok' | 'warn' }>`
  font-size: var(--text-sm);
  color: ${(props) =>
    props.$tone === 'warn' ? 'var(--color-danger-600)' : 'var(--color-text-muted)'};

  b {
    color: var(--color-text);
    font-weight: 700;
  }
`;

export const Preview = styled.p`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: 44px;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background-color: var(--color-brand-100);
  color: var(--color-brand-700);
  font-size: var(--text-sm);
  font-weight: 500;

  svg {
    flex-shrink: 0;
  }
`;
