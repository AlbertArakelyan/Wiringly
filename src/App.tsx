import ProjectPage from './components/pages/Project/ProjectPage/ProjectPage';
import ProjectsPage from './components/pages/Projects/ProjectsPage/ProjectsPage';
import useAppState from './hooks/useAppState';

const App = () => {
  const { openedProject } = useAppState();

  return openedProject ? <ProjectPage project={openedProject} /> : <ProjectsPage />;
};

export default App;
