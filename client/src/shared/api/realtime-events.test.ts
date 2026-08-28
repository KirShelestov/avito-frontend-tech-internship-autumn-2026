import { describe, expect, it } from 'vitest';
import { parseRealtimeEvent } from './realtime-events';

describe('parseRealtimeEvent', () => {
  it('парсит известные типы событий', () => {
    const created = parseRealtimeEvent(
      JSON.stringify({
        type: 'booking.created',
        occurredAt: '2026-08-18T09:00:00.000Z',
        data: { booking: { id: 'b1' } },
      }),
    );
    expect(created).toMatchObject({ type: 'booking.created' });

    const availability = parseRealtimeEvent(
      JSON.stringify({
        type: 'room.availability_changed',
        occurredAt: '2026-08-18T09:00:00.000Z',
        data: { roomId: 'r1', officeId: 'o1', available: false },
      }),
    );
    expect(availability).toMatchObject({ type: 'room.availability_changed' });

    expect(parseRealtimeEvent(JSON.stringify({ type: 'data.reset', data: {} }))).toMatchObject({
      type: 'data.reset',
    });
  });

  it('возвращает null для некорректных сообщений', () => {
    expect(parseRealtimeEvent('не json')).toBeNull();
    expect(parseRealtimeEvent(JSON.stringify({ foo: 1 }))).toBeNull();
    expect(parseRealtimeEvent(JSON.stringify({ type: 'unknown.event', data: {} }))).toBeNull();
    expect(parseRealtimeEvent(JSON.stringify({ type: 42 }))).toBeNull();
  });
});
