import styled from '@emotion/styled';

export const Form = styled.form`
  display: grid;
  gap: var(--space-4);
`;

export const TwoCols = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldBlock = styled.div`
  display: grid;
  gap: var(--space-1);
`;

export const FieldCaption = styled.span`
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
`;

export const FieldError = styled.span`
  font-size: var(--text-xs);
  color: var(--color-danger-600);
`;

export const Preview = styled.p`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  background-color: var(--color-brand-50);
  color: var(--color-brand-700);
  font-size: var(--text-sm);

  svg {
    flex-shrink: 0;
  }
`;
