import styled from '@emotion/styled';

export const CalendarRoot = styled.div`
  width: 280px;
  padding: var(--space-3);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-pop);
`;

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
`;

export const MonthTitle = styled.div`
  font-weight: 600;
  color: var(--color-brand-700);
`;

export const NavButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);

  &:hover:not(:disabled) {
    background-color: var(--color-surface-muted);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

export const WeekdayCell = styled.div`
  padding: var(--space-1) 0;
  text-align: center;
  font-size: var(--text-xs);
  color: var(--color-text-subtle);
`;

export const DayButton = styled.button<{
  $selected: boolean;
  $outside: boolean;
  $today: boolean;
}>`
  aspect-ratio: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  color: ${(props) =>
    props.$selected ? '#fff' : props.$outside ? 'var(--color-text-subtle)' : 'var(--color-text)'};
  background-color: ${(props) => (props.$selected ? 'var(--color-brand-600)' : 'transparent')};
  font-weight: ${(props) => (props.$selected || props.$today ? 600 : 400)};
  box-shadow: ${(props) =>
    props.$today && !props.$selected ? 'inset 0 0 0 1px var(--color-brand-500)' : 'none'};

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.$selected ? 'var(--color-brand-700)' : 'var(--color-brand-50)'};
  }

  &:disabled {
    color: var(--color-text-subtle);
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
