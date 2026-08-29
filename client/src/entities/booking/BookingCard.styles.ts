import styled from '@emotion/styled';

export const Card = styled.article`
  display: flex;
  align-items: center;
  gap: 28px;
  padding: var(--space-6);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);

  @media (max-width: 640px) {
    flex-wrap: wrap;
    gap: var(--space-4);
    padding: var(--space-4);
  }
`;

export const DateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex-shrink: 0;
  width: 76px;
  height: 76px;
  border-radius: var(--radius-lg);
  background-color: var(--color-bg);

  @media (max-width: 640px) {
    width: 64px;
    height: 64px;
  }
`;

export const Month = styled.span`
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-subtle);
`;

export const Day = styled.span`
  font-size: var(--text-2xl);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text);
`;

export const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Title = styled.h3`
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

export const Meta = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-1) var(--space-3);
  margin-top: var(--space-2);
  font-size: var(--text-base);
  color: var(--color-text-muted);
`;

export const RoomName = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  color: var(--color-brand-600);

  svg {
    flex-shrink: 0;
    color: var(--color-text-secondary);
  }
`;

export const Separator = styled.span`
  color: var(--color-text-subtle);
`;
