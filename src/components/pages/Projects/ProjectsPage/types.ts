import type { HTMLAttributes } from 'react';

import type { IProject } from '../../../../storage/types';

export interface IProjectsPageProps extends HTMLAttributes<HTMLDivElement> {
  projects: IProject[];
  isLoading?: boolean;
  error?: string;
  onCreateProject: (name: string) => void;
  onRenameProject: (id: string, name: string) => void;
  onDeleteProject: (id: string) => void;
  onOpenProject: (id: string) => void;
  listClassName?: string;
}
