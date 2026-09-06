import { useCallback, useEffect, useState } from 'react';

import { loadProjects, saveProjects } from '../storage/projectsStorage';
import type { IProject } from '../storage/types';

const readErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong while reading your projects.';

const useProjects = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    loadProjects()
      .then((stored) => {
        if (isActive) {
          setProjects(stored);
        }
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(readErrorMessage(loadError));
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
    setProjects(next);

    try {
      await saveProjects(next);
      setError('');
    } catch (saveError: unknown) {
      setError(
        saveError instanceof Error
          ? `Your change is not saved: ${saveError.message}`
          : 'Your change could not be saved to disk.',
      );
    }
  }, []);

  const createProject = useCallback(
    (name: string) => {
      const now = new Date().toISOString();
      const project: IProject = {
        id: crypto.randomUUID(),
        name,
        createdAt: now,
        updatedAt: now,
        modules: [],
        pairings: [],
      };

      return persist([...projects, project]);
    },
    [projects, persist],
  );

  const renameProject = useCallback(
    (id: string, name: string) =>
      persist(
        projects.map((project) =>
          project.id === id ? { ...project, name, updatedAt: new Date().toISOString() } : project,
        ),
      ),
    [projects, persist],
  );

  const deleteProject = useCallback(
    (id: string) => persist(projects.filter((project) => project.id !== id)),
    [projects, persist],
  );

  return { projects, isLoading, error, createProject, renameProject, deleteProject };
};

export default useProjects;
