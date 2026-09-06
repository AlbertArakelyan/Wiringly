import { appDataDir, join } from '@tauri-apps/api/path';
import { mkdir, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

import type { IProject, IProjectsFile } from './types';

const FILE_NAME = 'projects.json';
const FILE_VERSION = 1;

const getFilePath = async () => join(await appDataDir(), FILE_NAME);

const isProject = (value: unknown): value is IProject => {
  const project = value as IProject;

  return (
    typeof project?.id === 'string' &&
    typeof project.name === 'string' &&
    Array.isArray(project.modules) &&
    Array.isArray(project.pairings)
  );
};

export const loadProjects = async (): Promise<IProject[]> => {
  let raw: string;

  try {
    raw = await readTextFile(await getFilePath());
  } catch {
    // Nothing saved yet. Every other read failure looks the same from here and an empty
    // list is the right answer for all of them.
    return [];
  }

  let parsed: IProjectsFile;

  try {
    parsed = JSON.parse(raw) as IProjectsFile;
  } catch {
    // The file exists but is not JSON. Throwing keeps the next save from overwriting
    // whatever is in there.
    throw new Error('projects.json could not be read. Move or fix the file, then reopen wiringly.');
  }

  if (!Array.isArray(parsed?.projects)) {
    throw new Error('projects.json is not in the expected format.');
  }

  return parsed.projects.filter(isProject);
};

export const saveProjects = async (projects: IProject[]): Promise<void> => {
  const dir = await appDataDir();

  // The app data directory is not created until something writes to it.
  await mkdir(dir, { recursive: true });

  const file: IProjectsFile = { version: FILE_VERSION, projects };

  await writeTextFile(await join(dir, FILE_NAME), `${JSON.stringify(file, null, 2)}\n`);
};
