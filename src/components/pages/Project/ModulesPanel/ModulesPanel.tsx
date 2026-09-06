import { type ChangeEvent, type FC, type FormEvent, useState } from 'react';
import { WtkButton, WtkInput } from 'wtk-ui-react';

import styles from './ModulesPanel.module.css';
import type { IModulesPanelProps } from './types';

const ModulesPanel: FC<IModulesPanelProps> = ({
  modules,
  onAddModule,
  onDeleteModule,
  listClassName = '',
  className = '',
  ...rest
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
    setError('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Enter a module name.');
      return;
    }

    if (modules.some((module) => module.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError('This project already has that module.');
      return;
    }

    onAddModule(trimmedName);
    setName('');
  };

  return (
    <section className={`${styles.panel} ${className}`} {...rest}>
      <h2 className={styles.heading}>Modules</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <WtkInput
          placeholder="ESP32"
          value={name}
          error={error}
          autoComplete="off"
          wrapperClassName={styles.input}
          onChange={handleChange}
        />
        <WtkButton type="submit">Add</WtkButton>
      </form>

      {modules.length ? (
        <ul className={`${styles.list} ${listClassName}`}>
          {modules.map((module) => (
            <li key={module.id} className={styles.item}>
              <span className={styles.name}>{module.name}</span>
              <WtkButton
                size="sm"
                variant="flat"
                title={`Remove ${module.name}`}
                onClick={() => onDeleteModule(module.id)}
              >
                Remove
              </WtkButton>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.hint}>Add the modules you are wiring together, then pair them up.</p>
      )}
    </section>
  );
};

export default ModulesPanel;
