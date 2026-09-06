import { type FC } from 'react';

import styles from './EmptyMessage.module.css';
import type { IEmptyMessageProps } from './types';

const EmptyMessage: FC<IEmptyMessageProps> = ({
  title,
  description,
  action,
  titleClassName = '',
  descriptionClassName = '',
  actionClassName = '',
  className = '',
  ...rest
}) => (
  <div className={`${styles.emptyMessage} ${className}`} {...rest}>
    <p className={`${styles.title} ${titleClassName}`}>{title}</p>
    {description && (
      <p className={`${styles.description} ${descriptionClassName}`}>{description}</p>
    )}
    {action && <div className={`${styles.action} ${actionClassName}`}>{action}</div>}
  </div>
);

export default EmptyMessage;
