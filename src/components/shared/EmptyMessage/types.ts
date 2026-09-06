import type { HTMLAttributes, ReactNode } from 'react';

export interface IEmptyMessageProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
  actionClassName?: string;
}
