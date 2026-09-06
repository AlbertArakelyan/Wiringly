import { type FC } from 'react';
import { WtkButton } from 'wtk-ui-react';

import EmptyMessage from '../../../shared/EmptyMessage/EmptyMessage';
import HeaderBar from '../../../shared/HeaderBar/HeaderBar';
import styles from './ProjectPage.module.css';
import type { IProjectPageProps } from './types';

const ProjectPage: FC<IProjectPageProps> = ({ project, onBack, className = '', ...rest }) => (
  <div className={`${styles.page} ${className}`} {...rest}>
    <HeaderBar
      title={project.name}
      subtitle="Project"
      leading={<WtkButton onClick={onBack}>Back</WtkButton>}
    />
    <div className={styles.content}>
      <EmptyMessage
        title="Nothing wired up yet"
        description="Modules, pairings and export land on this screen next."
      />
    </div>
  </div>
);

export default ProjectPage;
