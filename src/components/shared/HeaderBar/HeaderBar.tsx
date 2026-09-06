import { type FC } from 'react';

import styles from './HeaderBar.module.css';
import type { IHeaderBarProps } from './types';

const HeaderBar: FC<IHeaderBarProps> = ({
  title,
  subtitle,
  leading,
  actions,
  leadingClassName = '',
  titlesClassName = '',
  titleClassName = '',
  subtitleClassName = '',
  actionsClassName = '',
  className = '',
  ...rest
}) => (
  <header className={`${styles.headerBar} ${className}`} {...rest}>
    {leading && <div className={`${styles.leading} ${leadingClassName}`}>{leading}</div>}
    <div className={`${styles.titles} ${titlesClassName}`}>
      <h1 className={`${styles.title} ${titleClassName}`}>{title}</h1>
      {subtitle && <p className={`${styles.subtitle} ${subtitleClassName}`}>{subtitle}</p>}
    </div>
    {actions && <div className={`${styles.actions} ${actionsClassName}`}>{actions}</div>}
  </header>
);

export default HeaderBar;
