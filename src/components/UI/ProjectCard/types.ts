import type { HTMLAttributes } from 'react';

import type { IProject } from '../../../storage/types';

export interface IProjectCardProps extends HTMLAttributes<HTMLDivElement> {
  project: IProject;
  onOpen: (id: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
  nameClassName?: string;
  metaClassName?: string;
  actionsClassName?: string;
}
