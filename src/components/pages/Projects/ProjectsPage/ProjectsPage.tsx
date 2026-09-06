import { type FC, useState } from 'react';
import { WtkButton } from 'wtk-ui-react';

import EmptyMessage from '../../../shared/EmptyMessage/EmptyMessage';
import HeaderBar from '../../../shared/HeaderBar/HeaderBar';
import ConfirmModal from '../../../UI/ConfirmModal/ConfirmModal';
import ProjectCard from '../../../UI/ProjectCard/ProjectCard';
import ProjectFormModal from '../../../UI/ProjectFormModal/ProjectFormModal';
import styles from './ProjectsPage.module.css';
import type { IProjectsPageProps } from './types';

const ProjectsPage: FC<IProjectsPageProps> = ({
  projects,
  isLoading = false,
  error = '',
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  onOpenProject,
  listClassName = '',
  className = '',
  ...rest
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [renamedProjectId, setRenamedProjectId] = useState('');
  const [deletedProjectId, setDeletedProjectId] = useState('');

  const renamedProject = projects.find((project) => project.id === renamedProjectId);
  const deletedProject = projects.find((project) => project.id === deletedProjectId);

  const openCreateForm = () => {
    setRenamedProjectId('');
    setIsFormOpen(true);
  };

  const openRenameForm = (id: string) => {
    setRenamedProjectId(id);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setRenamedProjectId('');
  };

  const handleSubmit = (name: string) => {
    if (renamedProject) {
      onRenameProject(renamedProject.id, name);
    } else {
      onCreateProject(name);
    }

    closeForm();
  };

  const handleDelete = () => {
    if (deletedProject) {
      onDeleteProject(deletedProject.id);
    }

    setDeletedProjectId('');
  };

  return (
    <div className={`${styles.page} ${className}`} {...rest}>
      <HeaderBar
        title="Projects"
        actions={
          <WtkButton variant="suggested" onClick={openCreateForm}>
            Add Project
          </WtkButton>
        }
      />

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.content}>
        {isLoading && <p className={styles.status}>Loading projects.</p>}

        {!isLoading && !projects.length && (
          <EmptyMessage
            title="No projects yet"
            description="A project holds the modules you wire together and the pairings between them."
            action={
              <WtkButton variant="suggested" onClick={openCreateForm}>
                Add Project
              </WtkButton>
            }
          />
        )}

        {!isLoading && Boolean(projects.length) && (
          <div className={`${styles.list} ${listClassName}`}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={onOpenProject}
                onRename={openRenameForm}
                onDelete={setDeletedProjectId}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectFormModal
        isOpen={isFormOpen}
        mode={renamedProject ? 'rename' : 'create'}
        initialName={renamedProject?.name ?? ''}
        takenNames={projects
          .filter((project) => project.id !== renamedProjectId)
          .map((project) => project.name)}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      {deletedProject && (
        <ConfirmModal
          isOpen
          isDestructive
          title="Delete project"
          message={`Delete "${deletedProject.name}"? Its modules and pairings go with it.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onClose={() => setDeletedProjectId('')}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
