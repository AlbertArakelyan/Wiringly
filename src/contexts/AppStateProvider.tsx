import {
  type FC,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import * as mutations from '../domain/projectMutations';
import { loadProjects, saveProjects } from '../storage/projectsStorage';
import type { IProject, PinSideType } from '../storage/types';
import { AppStateContext } from './AppStateContext';

const readErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const AppStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [openedProjectId, setOpenedProjectId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Actions read the list through this mirror so they stay referentially stable
  // instead of being rebuilt on every keystroke in a pin field.
  const projectsRef = useRef<IProject[]>([]);

  useEffect(() => {
    projectsRef.current = projects;
  }, [projects]);

  useEffect(() => {
    let isActive = true;

    loadProjects()
      .then((stored) => {
        if (isActive) {
          projectsRef.current = stored;
          setProjects(stored);
        }
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(readErrorMessage(loadError, 'Your projects could not be read.'));
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const persist = useCallback(async (next: IProject[]) => {
    projectsRef.current = next;
    setProjects(next);

    try {
      await saveProjects(next);
      setError('');
    } catch (saveError: unknown) {
      setError(
        `Your change is not saved: ${readErrorMessage(saveError, 'writing to disk failed.')}`,
      );
    }
  }, []);

  const replaceProject = useCallback(
    (updated: IProject) =>
      persist(
        projectsRef.current.map((project) =>
          project.id === updated.id
            ? { ...updated, updatedAt: new Date().toISOString() }
            : project,
        ),
      ),
    [persist],
  );

  const mutateOpenedProject = useCallback(
    (mutate: (project: IProject) => IProject) => {
      const opened = projectsRef.current.find((project) => project.id === openedProjectId);

      if (!opened) {
        return;
      }

      void replaceProject(mutate(opened));
    },
    [openedProjectId, replaceProject],
  );

  const openProject = useCallback((id: string) => setOpenedProjectId(id), []);
  const closeProject = useCallback(() => setOpenedProjectId(''), []);

  const createProject = useCallback(
    (name: string) => {
      const now = new Date().toISOString();

      void persist([
        ...projectsRef.current,
        {
          id: crypto.randomUUID(),
          name,
          createdAt: now,
          updatedAt: now,
          modules: [],
          pairings: [],
        },
      ]);
    },
    [persist],
  );

  const renameProject = useCallback(
    (id: string, name: string) => {
      const target = projectsRef.current.find((project) => project.id === id);

      if (target) {
        void replaceProject({ ...target, name });
      }
    },
    [replaceProject],
  );

  const deleteProject = useCallback(
    (id: string) => {
      if (id === openedProjectId) {
        setOpenedProjectId('');
      }

      void persist(projectsRef.current.filter((project) => project.id !== id));
    },
    [openedProjectId, persist],
  );

  const addModule = useCallback(
    (name: string) => mutateOpenedProject((project) => mutations.addModule(project, name)),
    [mutateOpenedProject],
  );

  const removeModule = useCallback(
    (moduleId: string) =>
      mutateOpenedProject((project) => mutations.removeModule(project, moduleId)),
    [mutateOpenedProject],
  );

  const addPairing = useCallback(
    (leftModuleId: string, rightModuleId: string) =>
      mutateOpenedProject((project) =>
        mutations.addPairing(project, leftModuleId, rightModuleId),
      ),
    [mutateOpenedProject],
  );

  const removePairing = useCallback(
    (pairingId: string) =>
      mutateOpenedProject((project) => mutations.removePairing(project, pairingId)),
    [mutateOpenedProject],
  );

  const addPin = useCallback(
    (pairingId: string) =>
      mutateOpenedProject((project) => mutations.addPin(project, pairingId)),
    [mutateOpenedProject],
  );

  const changePin = useCallback(
    (pairingId: string, pinId: string, side: PinSideType, value: string) =>
      mutateOpenedProject((project) =>
        mutations.changePin(project, pairingId, pinId, side, value),
      ),
    [mutateOpenedProject],
  );

  const removePin = useCallback(
    (pairingId: string, pinId: string) =>
      mutateOpenedProject((project) => mutations.removePin(project, pairingId, pinId)),
    [mutateOpenedProject],
  );

  const value = useMemo(
    () => ({
      projects,
      openedProject: projects.find((project) => project.id === openedProjectId) ?? null,
      isLoading,
      error,
      openProject,
      closeProject,
      createProject,
      renameProject,
      deleteProject,
      addModule,
      removeModule,
      addPairing,
      removePairing,
      addPin,
      changePin,
      removePin,
    }),
    [
      projects,
      openedProjectId,
      isLoading,
      error,
      openProject,
      closeProject,
      createProject,
      renameProject,
      deleteProject,
      addModule,
      removeModule,
      addPairing,
      removePairing,
      addPin,
      changePin,
      removePin,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export default AppStateProvider;
