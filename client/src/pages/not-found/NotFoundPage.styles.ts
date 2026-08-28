import styled from '@emotion/styled';

export const Wrap = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-3);
  padding: var(--space-12) var(--space-4);
`;

export const Code = styled.div`
  font-size: 96px;
  font-weight: 800;
  line-height: 1;
  color: var(--color-brand-600);
`;

export const Title = styled.h1`
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text);
`;

export const Text = styled.p`
  max-width: 42ch;
  color: var(--color-text-muted);
`;

export const Actions = styled.div`
  margin-top: var(--space-4);
`;
