import type { IPairing, IProject, PinSideType } from '../storage/types';

const mapPairing = (
  project: IProject,
  pairingId: string,
  mutate: (pairing: IPairing) => IPairing,
): IProject => ({
  ...project,
  pairings: project.pairings.map((pairing) =>
    pairing.id === pairingId ? mutate(pairing) : pairing,
  ),
});

export const addModule = (project: IProject, name: string): IProject => ({
  ...project,
  modules: [...project.modules, { id: crypto.randomUUID(), name }],
});

export const removeModule = (project: IProject, moduleId: string): IProject => ({
  ...project,
  modules: project.modules.filter((module) => module.id !== moduleId),
  // a pairing cannot survive losing one of its two sides
  pairings: project.pairings.filter(
    (pairing) => pairing.leftModuleId !== moduleId && pairing.rightModuleId !== moduleId,
  ),
});

export const addPairing = (
  project: IProject,
  leftModuleId: string,
  rightModuleId: string,
): IProject => ({
  ...project,
  pairings: [
    ...project.pairings,
    { id: crypto.randomUUID(), leftModuleId, rightModuleId, pins: [] },
  ],
});

export const removePairing = (project: IProject, pairingId: string): IProject => ({
  ...project,
  pairings: project.pairings.filter((pairing) => pairing.id !== pairingId),
});

export const addPin = (project: IProject, pairingId: string): IProject =>
  mapPairing(project, pairingId, (pairing) => ({
    ...pairing,
    pins: [...pairing.pins, { id: crypto.randomUUID(), leftPin: '', rightPin: '' }],
  }));

export const changePin = (
  project: IProject,
  pairingId: string,
  pinId: string,
  side: PinSideType,
  value: string,
): IProject =>
  mapPairing(project, pairingId, (pairing) => ({
    ...pairing,
    pins: pairing.pins.map((pin) => (pin.id === pinId ? { ...pin, [side]: value } : pin)),
  }));

export const removePin = (project: IProject, pairingId: string, pinId: string): IProject =>
  mapPairing(project, pairingId, (pairing) => ({
    ...pairing,
    pins: pairing.pins.filter((pin) => pin.id !== pinId),
  }));

export const findModuleName = (project: IProject, moduleId: string) =>
  project.modules.find((module) => module.id === moduleId)?.name ?? '';

export const findPairingsUsingModule = (project: IProject, moduleId: string) =>
  project.pairings.filter(
    (pairing) => pairing.leftModuleId === moduleId || pairing.rightModuleId === moduleId,
  );
