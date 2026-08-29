import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--page-gutter);

  @media (max-width: 640px) {
    padding: 0 var(--space-4);
  }
`;

export const Band = styled.section`
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
`;

export const PageBody = styled(Container)`
  padding-top: var(--space-6);
  padding-bottom: var(--space-10);
`;
