import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MemoryRouter } from 'react-router-dom';
import type { RoomSummary } from '@/shared/api';
import { StoryFrame } from '@/shared/ui/story-helpers.styles';
import { RoomCard } from './RoomCard';

const room: RoomSummary = {
  id: 'room-everest',
  officeId: 'office-moscow',
  name: 'Эверест',
  floor: 4,
  capacity: 12,
  features: [],
  office: {
    id: 'office-moscow',
    name: 'Офис Москва',
    address: 'ул. Лесная, 7',
    timezone: 'Europe/Moscow',
  },
};

const meta = {
  title: 'Entities/RoomCard',
  component: RoomCard,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <StoryFrame>
          <Story />
        </StoryFrame>
      </MemoryRouter>
    ),
  ],
  args: { room, onBook: fn() },
} satisfies Meta<typeof RoomCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithoutSlot: Story = {};

export const Available: Story = {
  args: {
    room: { ...room, available: true },
    occupancyLabel: 'Свободна весь день',
  },
};

export const Unavailable: Story = {
  args: {
    room: { ...room, available: false },
    occupancyLabel: 'Занята до 15:30',
  },
};
