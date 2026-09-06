import type { IWtkModalProps } from 'wtk-ui-react';

export type ProjectFormModeType = 'create' | 'rename';

export interface IProjectFormCopy {
  title: string;
  submitLabel: string;
}

export interface IProjectFormModalProps
  extends Omit<IWtkModalProps, 'children' | 'footer' | 'title' | 'onSubmit'> {
  mode?: ProjectFormModeType;
  initialName?: string;
  // names already used by other projects
  takenNames?: string[];
  onSubmit: (name: string) => void;
  formClassName?: string;
}
