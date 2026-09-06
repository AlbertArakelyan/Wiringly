import type { IWtkModalProps } from 'wtk-ui-react';

import type { IModule } from '../../../../storage/types';

export interface IAddPairingModalProps
  extends Omit<IWtkModalProps, 'children' | 'footer' | 'title' | 'onSubmit'> {
  modules: IModule[];
  onSubmit: (leftModuleId: string, rightModuleId: string) => void;
  formClassName?: string;
}
