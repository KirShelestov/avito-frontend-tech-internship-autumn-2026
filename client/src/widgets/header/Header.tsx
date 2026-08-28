import { CalendarCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMe } from '@/entities/user';
import { Avatar } from '@/shared/ui';
import { Bar, Brand, BrandMark, Nav, NavItem, UserBox } from './Header.styles';

/** «Константин Кузнецов» → «Константин К.» */
function shortName(displayName: string): string {
  const [first, last] = displayName.split(/\s+/);
  return last ? `${first} ${last.charAt(0)}.` : (first ?? '');
}

export function Header() {
  const { t } = useTranslation();
  const { data: me } = useMe();

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

      {me && (
        <UserBox>
          <span>{shortName(me.displayName)}</span>
          <Avatar name={me.displayName} initials={me.initials} src={me.avatarUrl} />
        </UserBox>
      )}
    </Bar>
  );
}
