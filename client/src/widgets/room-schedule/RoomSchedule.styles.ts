import styled from '@emotion/styled';

export const ROW_HEIGHT = 64;
export const DAY_START_MIN = 9 * 60;
export const DAY_END_MIN = 20 * 60;

export const Panel = styled.section`
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: var(--space-6);
`;

export const Head = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
`;

export const Title = styled.h2`
  font-size: var(--text-lg);
  font-weight: 700;
`;

export const DateLabel = styled.p`
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  margin-top: 2px;
`;

export const Grid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 56px 1fr;
`;

export const HourCell = styled.div`
  height: ${ROW_HEIGHT}px;
  font-size: var(--text-sm);
  color: var(--color-text-subtle);
  transform: translateY(-0.6em);
`;

export const Track = styled.div`
  position: relative;
`;

export const HourLine = styled.div`
  height: ${ROW_HEIGHT}px;
  border-top: 1px solid var(--color-border);

  &:last-of-type {
    border-bottom: 1px solid var(--color-border);
  }
`;

export const Event = styled.div<{ $top: number; $height: number; $own: boolean }>`
  position: absolute;
  left: var(--space-2);
  right: var(--space-2);
  top: ${(props) => props.$top}px;
  height: ${(props) => Math.max(props.$height, 24)}px;
  display: flex;
  align-items: center;
  padding: 0 var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background-color: ${(props) =>
    props.$own ? 'var(--color-available-bg)' : 'var(--color-busy-bg)'};
  color: ${(props) => (props.$own ? 'var(--color-available-text)' : 'var(--color-busy-text)')};
  border: 1px solid ${(props) => (props.$own ? 'var(--color-brand-500)' : 'transparent')};
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-6);
`;
