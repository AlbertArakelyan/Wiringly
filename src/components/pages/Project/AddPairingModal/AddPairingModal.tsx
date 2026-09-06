import { type ChangeEvent, type FC, type FormEvent, useEffect, useId, useState } from 'react';
import { WtkButton, WtkModal } from 'wtk-ui-react';

import Select from '../../../UI/Select/Select';
import styles from './AddPairingModal.module.css';
import type { IAddPairingModalProps } from './types';

const AddPairingModal: FC<IAddPairingModalProps> = ({
  isOpen,
  modules,
  onSubmit,
  onClose,
  formClassName = '',
  size = 'sm',
  ...rest
}) => {
  const formId = useId();
  const [leftModuleId, setLeftModuleId] = useState('');
  const [rightModuleId, setRightModuleId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setLeftModuleId('');
    setRightModuleId('');
    setError('');
  }, [isOpen]);

  const options = modules.map((module) => ({ value: module.id, label: module.name }));

  const handleLeftChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLeftModuleId(event.currentTarget.value);
    setError('');
  };

  const handleRightChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRightModuleId(event.currentTarget.value);
    setError('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!leftModuleId || !rightModuleId) {
      setError('Pick a module on both sides.');
      return;
    }

    if (leftModuleId === rightModuleId) {
      setError('Pick two different modules.');
      return;
    }

    onSubmit(leftModuleId, rightModuleId);
  };

  return (
    <WtkModal
      isOpen={isOpen}
      title="Add Pairing"
      size={size}
      onClose={onClose}
      footer={
        <>
          <WtkButton onClick={onClose}>Cancel</WtkButton>
          <WtkButton type="submit" form={formId} variant="suggested">
            Add
          </WtkButton>
        </>
      }
      {...rest}
    >
      <form id={formId} className={`${styles.form} ${formClassName}`} onSubmit={handleSubmit}>
        <Select
          options={options}
          placeholder="Select a module"
          value={leftModuleId}
          onChange={handleLeftChange}
        />
        <span className={styles.to}>to</span>
        <Select
          options={options}
          placeholder="Select a module"
          value={rightModuleId}
          error={error}
          onChange={handleRightChange}
        />
      </form>
    </WtkModal>
  );
};

export default AddPairingModal;
