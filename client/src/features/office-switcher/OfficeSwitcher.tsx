import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Office } from '@/shared/api';
import { Dot, Label, Meta, NativeSelect, Root, SelectWrap } from './OfficeSwitcher.styles';
import { useOfficeClock } from './useOfficeClock';

export interface OfficeSwitcherProps {
  offices: Office[];
  selectedOfficeId: string | null;
  onSelect: (officeId: string) => void;
}

export function OfficeSwitcher({ offices, selectedOfficeId, onSelect }: OfficeSwitcherProps) {
  const { t } = useTranslation();
  const selected = offices.find((o) => o.id === selectedOfficeId);
  const { time, abbr } = useOfficeClock(selected?.timezone);

  return (
    <Root>
      <SelectWrap $placeholder={!selected}>
        <Label aria-hidden="true">{selected?.name ?? t('rooms.chooseOffice')}</Label>
        <ChevronDown size={18} strokeWidth={2.5} aria-hidden="true" />
        <NativeSelect
          value={selectedOfficeId ?? ''}
          aria-label={t('rooms.chooseOffice')}
          onChange={(event) => {
            onSelect(event.target.value);
          }}
        >
          <option value="" disabled>
            {t('rooms.chooseOffice')}
          </option>
          {offices.map((office) => (
            <option key={office.id} value={office.id}>
              {office.name}
            </option>
          ))}
        </NativeSelect>
      </SelectWrap>

      <Meta>
        <span>{selected?.address ?? t('rooms.addressUnknown')}</span>
        <Dot aria-hidden="true">•</Dot>
        <span>{t('rooms.localTime', { time, zone: abbr }).trim()}</span>
      </Meta>
    </Root>
  );
}
