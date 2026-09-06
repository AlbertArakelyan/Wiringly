import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';

import type { IProject } from '../storage/types';

export const buildPairingTitle = (
  leftModuleName: string,
  rightModuleName: string,
) => `${leftModuleName} -> ${rightModuleName}`;

export const buildWiringText = (project: IProject) => {
  const moduleName = (id: string) =>
    project.modules.find((module) => module.id === id)?.name ?? '';

  const sections = project.pairings.map((pairing) => {
    const leftModuleName = moduleName(pairing.leftModuleId);
    const rightModuleName = moduleName(pairing.rightModuleId);

    const lines = pairing.pins
      .filter((pin) => pin.leftPin.trim() || pin.rightPin.trim())
      .map(
        (pin) =>
          `${leftModuleName}.[${pin.leftPin.trim()}] -> ${rightModuleName}.[${pin.rightPin.trim()}]`,
      );

    return [`//// ${buildPairingTitle(leftModuleName, rightModuleName)}`, '', ...lines].join('\n');
  });

  return sections.join('\n\n---\n\n');
};

// Returns the path written to, or an empty string when the save dialog was dismissed.
export const exportWiring = async (project: IProject) => {
  const path = await save({
    defaultPath: `${project.name || 'wiring'}.txt`,
    filters: [{ name: 'Text', extensions: ['txt'] }],
  });

  if (!path) {
    return '';
  }

  await writeTextFile(path, `${buildWiringText(project)}\n`);

  return path;
};
