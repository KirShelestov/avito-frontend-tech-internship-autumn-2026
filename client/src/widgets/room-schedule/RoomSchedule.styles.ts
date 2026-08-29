import styled from '@emotion/styled';

export const ROW_HEIGHT = 48;
export const DAY_START_MIN = 9 * 60;
export const DAY_END_MIN = 20 * 60;

export const Panel = styled.section`
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  padding: var(--space-8);

  @media (max-width: 640px) {
    padding: var(--space-4);
  }
`;

export const Head = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
`;

export const Title = styled.h2`
  font-size: var(--text-xl);
  font-weight: 700;
  line-height: 1.3;
`;

export const DateLabel = styled.p`
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  margin-top: 2px;
`;

export const Grid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 60px 1fr;
`;

export const HourCell = styled.div`
  height: ${ROW_HEIGHT}px;
  padding-top: 1px;
  font-size: 13px;
  line-height: 18px;
  color: var(--color-text-muted);
`;

export const Track = styled.div`
  position: relative;
  border-bottom: 1px solid var(--color-border);
`;

export const HourLine = styled.div`
  height: ${ROW_HEIGHT}px;
  border-top: 1px solid var(--color-border);
`;

export const Event = styled.div<{ $top: number; $height: number; $own: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  top: ${(props) => props.$top + 1}px;
  height: ${(props) => Math.max(props.$height - 1, 24)}px;
  display: flex;
  align-items: center;
  padding: 0 var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 500;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background-color: ${(props) =>
    props.$own ? 'var(--color-available-bg)' : 'var(--color-surface-muted)'};
  color: ${(props) => (props.$own ? 'var(--color-available-text)' : 'var(--color-text-secondary)')};
  border: ${(props) =>
    props.$own ? '1.5px solid var(--color-brand-600)' : '1px solid var(--color-border)'};
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-8);
`;
