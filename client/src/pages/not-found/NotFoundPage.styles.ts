import styled from '@emotion/styled';

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--space-3);
  min-height: calc(100vh - var(--header-height));
  padding: var(--space-10) var(--space-4);
`;

export const Code = styled.div`
  font-size: 120px;
  font-weight: 800;
  line-height: 1;
  color: var(--color-brand-600);
`;

export const Title = styled.h1`
  margin-top: var(--space-3);
  font-size: var(--text-2xl);
  font-weight: 700;
`;

export const Text = styled.p`
  max-width: 46ch;
  font-size: var(--text-base);
  color: var(--color-text-secondary);
`;

export const Actions = styled.div`
  margin-top: var(--space-5);
`;
