import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { zoneAbbr } from '@/shared/lib/datetime';

export function useOfficeClock(timezone: string | undefined): { time: string; abbr: string } {
  const [value, setValue] = useState(() => read(timezone));

  useEffect(() => {
    setValue(read(timezone));
    if (!timezone) return;
    const id = setInterval(() => {
      setValue(read(timezone));
    }, 15_000);
    return () => {
      clearInterval(id);
    };
  }, [timezone]);

  return value;
}

function read(timezone: string | undefined): { time: string; abbr: string } {
  if (!timezone) return { time: '--', abbr: '' };
  const dt = DateTime.now().setZone(timezone);
  return { time: dt.toFormat('HH:mm'), abbr: zoneAbbr(timezone, dt) };
}
