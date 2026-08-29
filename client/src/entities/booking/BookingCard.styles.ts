import styled from '@emotion/styled';

export const Card = styled.article`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
`;

export const DateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-md);
  background-color: var(--color-surface-muted);
`;

export const Month = styled.span`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
`;

export const Day = styled.span`
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
`;

export const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Title = styled.h3`
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
`;

export const Meta = styled.p`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: 2px;
  font-size: var(--text-sm);
  color: var(--color-text-muted);

  svg {
    flex-shrink: 0;
    color: var(--color-brand-600);
  }

  b {
    color: var(--color-brand-600);
    font-weight: 600;
  }
`;
