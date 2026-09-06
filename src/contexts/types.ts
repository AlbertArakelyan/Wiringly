import type { IProject, PinSideType } from '../storage/types';

export interface IAppStateContext {
  projects: IProject[];
  openedProject: IProject | null;
  isLoading: boolean;
  error: string;

  openProject: (id: string) => void;
  closeProject: () => void;

  createProject: (name: string) => void;
  renameProject: (id: string, name: string) => void;
  deleteProject: (id: string) => void;

  // everything below acts on the opened project, and is a no-op when none is open
  addModule: (name: string) => void;
  removeModule: (moduleId: string) => void;
  addPairing: (leftModuleId: string, rightModuleId: string) => void;
  removePairing: (pairingId: string) => void;
  addPin: (pairingId: string) => void;
  changePin: (pairingId: string, pinId: string, side: PinSideType, value: string) => void;
  removePin: (pairingId: string, pinId: string) => void;
}
