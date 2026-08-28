import { currentUser, seedBookings } from '../fixtures';

export const db = {
  currentUserId: currentUser.id,
  bookings: seedBookings(),
};

export function resetDb(now: Date = new Date()): void {
  db.currentUserId = currentUser.id;
  db.bookings = seedBookings(now);
}

export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return new Date(aStart) < new Date(bEnd) && new Date(aEnd) > new Date(bStart);
}
