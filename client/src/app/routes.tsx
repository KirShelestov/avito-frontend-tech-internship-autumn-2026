import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import { NotFoundPage } from '@/pages/not-found';
import { Spinner } from '@/shared/ui';
import { RootLayout } from './RootLayout';
import { RouteError } from './RouteError';
import { RouteFallback } from './routes.styles';

const RoomsPage = lazy(() => import('@/pages/rooms').then((m) => ({ default: m.RoomsPage })));
const RoomDetailsPage = lazy(() =>
  import('@/pages/room-details').then((m) => ({ default: m.RoomDetailsPage })),
);
const BookingsPage = lazy(() =>
  import('@/pages/bookings').then((m) => ({ default: m.BookingsPage })),
);

function withSuspense(node: ReactNode): ReactNode {
  return (
    <Suspense
      fallback={
        <RouteFallback>
          <Spinner size={28} />
        </RouteFallback>
      }
    >
      {node}
    </Suspense>
  );
}

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Navigate to="/rooms" replace /> },
      { path: 'rooms', element: withSuspense(<RoomsPage />) },
      { path: 'rooms/:roomId', element: withSuspense(<RoomDetailsPage />) },
      { path: 'bookings', element: withSuspense(<BookingsPage />) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
