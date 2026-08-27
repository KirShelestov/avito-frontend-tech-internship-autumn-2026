import styled from '@emotion/styled';

const Layout = styled.main`
  padding: var(--space-8);
`;

const Subtitle = styled.p`
  color: var(--color-text-muted);
`;

export function App() {
  return (
    <Layout>
      <h1>BookRoom</h1>
      <Subtitle>Каркас приложения. Экраны и маршруты появятся на следующих этапах.</Subtitle>
    </Layout>
  );
}
