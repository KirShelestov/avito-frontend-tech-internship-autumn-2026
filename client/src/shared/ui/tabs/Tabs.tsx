import * as RadixTabs from '@radix-ui/react-tabs';
import type { ReactNode } from 'react';
import { Content, List, Trigger } from './Tabs.styles';

export interface TabItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  'aria-label'?: string;
  className?: string;
}

export function Tabs({
  tabs,
  value,
  onValueChange,
  children,
  'aria-label': ariaLabel,
  className,
}: TabsProps) {
  return (
    <RadixTabs.Root value={value} onValueChange={onValueChange} className={className}>
      <List aria-label={ariaLabel}>
        {tabs.map((tab) => (
          <Trigger key={tab.value} value={tab.value} disabled={tab.disabled}>
            {tab.label}
          </Trigger>
        ))}
      </List>
      <Content value={value}>{children}</Content>
    </RadixTabs.Root>
  );
}
