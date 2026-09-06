import type { HTMLAttributes } from 'react';

import type { IProject } from '../../../../storage/types';

export interface IProjectPageProps extends HTMLAttributes<HTMLDivElement> {
  project: IProject;
  onBack: () => void;
}
