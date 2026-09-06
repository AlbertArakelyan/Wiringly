import type { HTMLAttributes } from 'react';

import type { IModule } from '../../../../storage/types';

export interface IModulesPanelProps extends HTMLAttributes<HTMLElement> {
  modules: IModule[];
  onAddModule: (name: string) => void;
  onDeleteModule: (id: string) => void;
  listClassName?: string;
}
