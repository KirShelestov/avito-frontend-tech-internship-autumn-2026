import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ConnectionStatusBanner } from '@/features/realtime';
import { Header } from '@/widgets/header';
import { Main } from './RootLayout.styles';

export function RootLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <>
      <ConnectionStatusBanner />
      <Header />
      <Main>
        <Outlet />
      </Main>
    </>
  );
}
