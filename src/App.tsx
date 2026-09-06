import { useState } from 'react';

import ProjectPage from './components/pages/Project/ProjectPage/ProjectPage';
import ProjectsPage from './components/pages/Projects/ProjectsPage/ProjectsPage';
import useProjects from './hooks/useProjects';

const App = () => {
  const {
    projects,
    isLoading,
    error,
    createProject,
    renameProject,
    deleteProject,
    updateProject,
  } = useProjects();
  const [openedProjectId, setOpenedProjectId] = useState('');

  const openedProject = projects.find((project) => project.id === openedProjectId);

  if (openedProject) {
    return (
      <ProjectPage
        project={openedProject}
        onChangeProject={updateProject}
        onBack={() => setOpenedProjectId('')}
      />
    );
  }

  return (
    <ProjectsPage
      projects={projects}
      isLoading={isLoading}
      error={error}
      onCreateProject={createProject}
      onRenameProject={renameProject}
      onDeleteProject={deleteProject}
      onOpenProject={setOpenedProjectId}
    />
  );
};

export default App;
