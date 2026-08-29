import styled from '@emotion/styled';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ConnectionStatusBanner } from '@/features/realtime';
import { Header } from '@/widgets/header';

const Content = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-6);
`;

export function RootLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <>
      <ConnectionStatusBanner />
      <Header />
      <Content>
        <Outlet />
      </Content>
    </>
  );
}
