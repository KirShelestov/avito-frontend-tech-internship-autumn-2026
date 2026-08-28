import { Navigate, type RouteObject } from 'react-router-dom';
import { BookingsPage } from '@/pages/bookings';
import { NotFoundPage } from '@/pages/not-found';
import { RoomDetailsPage } from '@/pages/room-details';
import { RoomsPage } from '@/pages/rooms';
import { RootLayout } from './RootLayout';
import { RouteError } from './RouteError';

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Navigate to="/rooms" replace /> },
      { path: 'rooms', element: <RoomsPage /> },
      { path: 'rooms/:roomId', element: <RoomDetailsPage /> },
      { path: 'bookings', element: <BookingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
