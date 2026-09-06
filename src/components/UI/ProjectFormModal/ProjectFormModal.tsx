import {
  type ChangeEvent,
  type FC,
  type FormEvent,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import { WtkButton, WtkInput, WtkModal } from 'wtk-ui-react';

import type { IProjectFormCopy, IProjectFormModalProps, ProjectFormModeType } from './types';

const ProjectFormModal: FC<IProjectFormModalProps> = ({
  isOpen,
  mode = 'create',
  initialName = '',
  takenNames = [],
  onSubmit,
  onClose,
  formClassName = '',
  size = 'sm',
  ...rest
}) => {
  const formId = useId();
  const inputId = useId();
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  const copy = useMemo(() => {
    const copyMapping: Record<ProjectFormModeType, IProjectFormCopy> = {
      create: { title: 'New project', submitLabel: 'Create' },
      rename: { title: 'Rename project', submitLabel: 'Save' },
    };

    return copyMapping[mode] || copyMapping.create;
  }, [mode]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(initialName);
    setError('');

    // The dialog would otherwise open with its close button focused. WtkInput does not
    // forward a ref, so the field is reached by id once the dialog is on screen.
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(inputId)?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, initialName, inputId]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
    setError('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Enter a project name.');
      return;
    }

    if (takenNames.some((taken) => taken.toLowerCase() === trimmedName.toLowerCase())) {
      setError('A project with this name already exists.');
      return;
    }

    onSubmit(trimmedName);
  };

  return (
    <WtkModal
      isOpen={isOpen}
      title={copy.title}
      size={size}
      onClose={onClose}
      footer={
        <>
          <WtkButton onClick={onClose}>Cancel</WtkButton>
          <WtkButton type="submit" form={formId} variant="suggested">
            {copy.submitLabel}
          </WtkButton>
        </>
      }
      {...rest}
    >
      <form id={formId} className={formClassName} onSubmit={handleSubmit}>
        <WtkInput
          id={inputId}
          label="Project name"
          placeholder="ESP32 bench rig"
          value={name}
          error={error}
          autoComplete="off"
          onChange={handleChange}
        />
      </form>
    </WtkModal>
  );
};

export default ProjectFormModal;
