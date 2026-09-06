// Modules and pairings are empty until the project screen is built, but they are part of the
// stored shape now so the file does not need migrating when that lands.
export interface IModule {
  id: string;
  name: string;
}

export interface IPin {
  id: string;
  leftPin: string;
  rightPin: string;
}

// which side of a pin row an edit lands on
export type PinSideType = 'leftPin' | 'rightPin';

export interface IPairing {
  id: string;
  leftModuleId: string;
  rightModuleId: string;
  pins: IPin[];
}

export interface IProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  modules: IModule[];
  pairings: IPairing[];
}

export interface IProjectsFile {
  version: number;
  projects: IProject[];
}
