import { CalendarCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMe } from '@/entities/user';
import { useRealtimeStatus } from '@/features/realtime';
import { Avatar } from '@/shared/ui';
import {
  Bar,
  Brand,
  BrandMark,
  ConnectionDot,
  Nav,
  NavItem,
  UserBox,
  UserName,
} from './Header.styles';

/** «Константин Кузнецов» → «Константин К.» */
function shortName(displayName: string): string {
  const [first, last] = displayName.split(/\s+/);
  return last ? `${first} ${last.charAt(0)}.` : (first ?? '');
}

export function Header() {
  const { t } = useTranslation();
  const { data: me } = useMe();
  const status = useRealtimeStatus();

  const dot =
    status === 'open'
      ? { tone: 'ok' as const, label: t('realtime.statusOnline') }
      : status === 'connecting'
        ? { tone: 'wait' as const, label: t('realtime.statusConnecting') }
        : { tone: 'off' as const, label: t('realtime.statusOffline') };

  return (
    <Bar>
      <Brand>
        <BrandMark aria-hidden="true">
          <CalendarCheck size={20} />
        </BrandMark>
        {t('app.title')}
      </Brand>

      <Nav aria-label={t('nav.rooms')}>
        <NavItem to="/rooms">{t('nav.rooms')}</NavItem>
        <NavItem to="/bookings">{t('nav.bookings')}</NavItem>
      </Nav>

      <UserBox>
        <ConnectionDot $tone={dot.tone} role="status" aria-label={dot.label} title={dot.label} />
        {me && (
          <>
            <UserName>{shortName(me.displayName)}</UserName>
            <Avatar size={38} name={me.displayName} initials={me.initials} src={me.avatarUrl} />
          </>
        )}
      </UserBox>
    </Bar>
  );
}
