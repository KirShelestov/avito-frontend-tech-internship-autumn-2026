import { ChevronRight } from 'lucide-react';
import { Fragment, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Current, Item, List, Nav, Separator } from './Breadcrumbs.styles';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  label?: string;
  className?: string;
}

export function Breadcrumbs({ items, label, className }: BreadcrumbsProps) {
  const { t } = useTranslation();

  return (
    <Nav aria-label={label ?? t('breadcrumbs.label')} className={className}>
      <List>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={index}>
              <Item aria-current={isLast ? 'page' : undefined}>
                {isLast || !item.href ? (
                  <Current>{item.label}</Current>
                ) : (
                  <a href={item.href}>{item.label}</a>
                )}
              </Item>
              {!isLast && (
                <Separator aria-hidden="true">
                  <ChevronRight size={14} strokeWidth={2.5} />
                </Separator>
              )}
            </Fragment>
          );
        })}
      </List>
    </Nav>
  );
}
