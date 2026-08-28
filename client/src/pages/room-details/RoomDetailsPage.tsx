import { useParams } from 'react-router-dom';

export function RoomDetailsPage() {
  const { roomId } = useParams();
  return <h1>Переговорная {roomId}</h1>;
}
