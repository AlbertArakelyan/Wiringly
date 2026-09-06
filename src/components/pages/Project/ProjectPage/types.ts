import type { HTMLAttributes } from 'react';

import type { IProject } from '../../../../storage/types';

export interface IProjectPageProps extends HTMLAttributes<HTMLDivElement> {
  project: IProject;
  onChangeProject: (project: IProject) => void;
  onBack: () => void;
  contentClassName?: string;
}
