import type { HTMLAttributes, ReactNode } from 'react';

export interface IHeaderBarProps extends HTMLAttributes<HTMLElement> {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  actions?: ReactNode;
  leadingClassName?: string;
  titlesClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  actionsClassName?: string;
}
