import { type FC } from 'react';
import { WtkButton } from 'wtk-ui-react';

import styles from './ProjectCard.module.css';
import type { IProjectCardProps } from './types';

const formatDate = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
};

const ProjectCard: FC<IProjectCardProps> = ({
  project,
  onOpen,
  onRename,
  onDelete,
  nameClassName = '',
  metaClassName = '',
  actionsClassName = '',
  className = '',
  ...rest
}) => {
  const createdAt = formatDate(project.createdAt);
  const pairingCount = project.pairings.length;

  return (
    <div className={`${styles.card} ${className}`} {...rest}>
      <button className={styles.open} type="button" onClick={() => onOpen(project.id)}>
        <span className={`${styles.name} ${nameClassName}`}>{project.name}</span>
        <span className={`${styles.meta} ${metaClassName}`}>
          {pairingCount === 1 ? '1 pairing' : `${pairingCount} pairings`}
          {createdAt && `, created ${createdAt}`}
        </span>
      </button>
      <div className={`${styles.actions} ${actionsClassName}`}>
        <WtkButton size="sm" onClick={() => onRename(project.id)}>
          Rename
        </WtkButton>
        <WtkButton size="sm" variant="destructive" onClick={() => onDelete(project.id)}>
          Delete
        </WtkButton>
      </div>
    </div>
  );
};

export default ProjectCard;
