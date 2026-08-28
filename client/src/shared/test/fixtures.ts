import type { BookingView, Office, Room, RoomFeature, User } from '@/shared/api/types';

export const currentUser: User = {
  id: 'user-konstantin',
  login: 'kkuznetsov',
  displayName: 'Константин Кузнецов',
  email: 'kkuznetsov@example.test',
  avatarUrl: null,
  initials: 'КК',
};

export const otherUser: User = {
  id: 'user-anna',
  login: 'asmirnova',
  displayName: 'Анна Смирнова',
  email: 'asmirnova@example.test',
  avatarUrl: null,
  initials: 'АС',
};

export const offices: Office[] = [
  {
    id: 'office-moscow',
    name: 'Офис Москва',
    address: 'Москва, ул. Лесная, 7',
    timezone: 'Europe/Moscow',
  },
  {
    id: 'office-saint-petersburg',
    name: 'Офис Санкт-Петербург',
    address: 'Санкт-Петербург, наб. реки Карповки, 5',
    timezone: 'Europe/Moscow',
  },
];

const f = (code: string, name: string): RoomFeature => ({ code, name });

export const rooms: Room[] = [
  {
    id: 'room-everest',
    officeId: 'office-moscow',
    name: 'Эверест',
    floor: 4,
    capacity: 12,
    features: [
      f('display', 'Проектор и ТВ-панель 4К'),
      f('whiteboard', 'Маркерная доска'),
      f('video', 'Система видеоконференций'),
    ],
  },
  {
    id: 'room-kazbek',
    officeId: 'office-moscow',
    name: 'Казбек',
    floor: 3,
    capacity: 8,
    features: [f('display', 'ТВ-панель'), f('whiteboard', 'Маркерная доска')],
  },
  {
    id: 'room-elbrus',
    officeId: 'office-moscow',
    name: 'Эльбрус',
    floor: 5,
    capacity: 6,
    features: [f('video', 'Система видеоконференций')],
  },
  {
    id: 'room-altai',
    officeId: 'office-moscow',
    name: 'Алтай',
    floor: 2,
    capacity: 4,
    features: [f('whiteboard', 'Маркерная доска')],
  },
  {
    id: 'room-neva',
    officeId: 'office-saint-petersburg',
    name: 'Нева',
    floor: 6,
    capacity: 10,
    features: [f('display', 'ТВ-панель'), f('video', 'Система видеоконференций')],
  },
  {
    id: 'room-ladoga',
    officeId: 'office-saint-petersburg',
    name: 'Ладога',
    floor: 6,
    capacity: 4,
    features: [f('whiteboard', 'Маркерная доска')],
  },
];

export const roomById = (id: string): Room | undefined => rooms.find((room) => room.id === id);
export const officeById = (id: string): Office | undefined =>
  offices.find((office) => office.id === id);
export const userById = (id: string): User | undefined =>
  [currentUser, otherUser].find((user) => user.id === id);

export interface RawBooking {
  id: string;
  roomId: string;
  userId: string;
  title: string;
  comment: string | null;
  startsAt: string;
  endsAt: string;
  createdAt: string;
}

/** Собирает «толстую» проекцию брони, как это делает бэкенд. */
export function toBookingView(raw: RawBooking): BookingView {
  const room = roomById(raw.roomId);
  if (!room) throw new Error(`Неизвестная комната ${raw.roomId}`);
  const office = officeById(room.officeId);
  const owner = userById(raw.userId);
  if (!office || !owner) throw new Error('Битые тестовые данные');
  return { ...raw, room, office, owner };
}

const HOUR = 60 * 60 * 1000;

export function seedBookings(now: Date = new Date()): RawBooking[] {
  const at = (days: number, hour: number, minute = 0): string => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };
  const createdAt = new Date(now.getTime() - 2 * 24 * HOUR).toISOString();

  return [
    {
      id: 'booking-past-current-user',
      roomId: 'room-everest',
      userId: currentUser.id,
      title: 'Ретроспектива команды',
      comment: 'Обсуждаем итоги спринта',
      startsAt: at(-1, 15),
      endsAt: at(-1, 16),
      createdAt,
    },
    {
      id: 'booking-future-current-user',
      roomId: 'room-everest',
      userId: currentUser.id,
      title: 'Ежедневная встреча команды',
      comment: 'Синхронизация по задачам',
      startsAt: at(1, 15),
      endsAt: at(1, 16),
      createdAt,
    },
    {
      id: 'booking-future-current-user-2',
      roomId: 'room-kazbek',
      userId: currentUser.id,
      title: 'Собеседование с разработчиком',
      comment: null,
      startsAt: at(2, 11, 30),
      endsAt: at(2, 12, 30),
      createdAt,
    },
    {
      id: 'booking-future-other-user',
      roomId: 'room-elbrus',
      userId: otherUser.id,
      title: 'Планирование продукта',
      comment: 'Квартальные цели',
      startsAt: at(1, 10),
      endsAt: at(1, 11, 30),
      createdAt,
    },
  ];
}
