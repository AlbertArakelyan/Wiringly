import { type FC, useState } from 'react';
import { WtkButton } from 'wtk-ui-react';

import { findModuleName, findPairingsUsingModule } from '../../../../domain/projectMutations';
import { exportWiring } from '../../../../export/wiringExport';
import useAppState from '../../../../hooks/useAppState';
import EmptyMessage from '../../../shared/EmptyMessage/EmptyMessage';
import HeaderBar from '../../../shared/HeaderBar/HeaderBar';
import ConfirmModal from '../../../UI/ConfirmModal/ConfirmModal';
import AddPairingModal from '../AddPairingModal/AddPairingModal';
import ModulesPanel from '../ModulesPanel/ModulesPanel';
import PairingSection from '../PairingSection/PairingSection';
import styles from './ProjectPage.module.css';
import type { IProjectPageProps } from './types';

const ProjectPage: FC<IProjectPageProps> = ({
  project,
  contentClassName = '',
  className = '',
  ...rest
}) => {
  const {
    error,
    closeProject,
    addModule,
    removeModule,
    addPairing,
    removePairing,
    addPin,
    changePin,
    removePin,
  } = useAppState();

  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);
  const [deletedModuleId, setDeletedModuleId] = useState('');
  const [exportError, setExportError] = useState('');

  const deletedModule = project.modules.find((module) => module.id === deletedModuleId);
  const affectedPairings = findPairingsUsingModule(project, deletedModuleId);
  const canPair = project.modules.length >= 2;

  const handleAddPairing = (leftModuleId: string, rightModuleId: string) => {
    addPairing(leftModuleId, rightModuleId);
    setIsPairingModalOpen(false);
  };

  const handleRemoveModule = () => {
    removeModule(deletedModuleId);
    setDeletedModuleId('');
  };

  const handleExport = async () => {
    try {
      await exportWiring(project);
      setExportError('');
    } catch (exportFailure: unknown) {
      setExportError(
        exportFailure instanceof Error
          ? `Export failed: ${exportFailure.message}`
          : 'Export failed.',
      );
    }
  };

  return (
    <div className={`${styles.page} ${className}`} {...rest}>
      <HeaderBar
        title={project.name}
        leading={<WtkButton onClick={closeProject}>Back</WtkButton>}
        actions={
          <>
            <WtkButton
              disabled={!canPair}
              title={canPair ? 'Pair two modules up' : 'Add two modules first'}
              onClick={() => setIsPairingModalOpen(true)}
            >
              Add Pairing
            </WtkButton>
            <WtkButton
              variant="suggested"
              disabled={!project.pairings.length}
              onClick={handleExport}
            >
              Export
            </WtkButton>
          </>
        }
      />

      {(error || exportError) && <p className={styles.error}>{error || exportError}</p>}

      <div className={`${styles.content} ${contentClassName}`}>
        <ModulesPanel
          modules={project.modules}
          onAddModule={addModule}
          onDeleteModule={setDeletedModuleId}
        />

        {project.pairings.length ? (
          <div className={styles.pairings}>
            {project.pairings.map((pairing) => (
              <PairingSection
                key={pairing.id}
                pairing={pairing}
                leftModuleName={findModuleName(project, pairing.leftModuleId)}
                rightModuleName={findModuleName(project, pairing.rightModuleId)}
                onAddPin={addPin}
                onChangePin={changePin}
                onDeletePin={removePin}
                onDeletePairing={removePairing}
              />
            ))}
          </div>
        ) : (
          <EmptyMessage
            title="No pairings yet"
            description="Add at least two modules, then pair them to start listing pins."
            className={styles.empty}
          />
        )}
      </div>

      <AddPairingModal
        isOpen={isPairingModalOpen}
        modules={project.modules}
        onSubmit={handleAddPairing}
        onClose={() => setIsPairingModalOpen(false)}
      />

      {deletedModule && (
        <ConfirmModal
          isOpen
          isDestructive
          title="Remove module"
          message={
            affectedPairings.length
              ? `Remove "${deletedModule.name}"? Its ${affectedPairings.length === 1 ? 'pairing goes' : 'pairings go'} with it.`
              : `Remove "${deletedModule.name}"?`
          }
          confirmLabel="Remove"
          onConfirm={handleRemoveModule}
          onClose={() => setDeletedModuleId('')}
        />
      )}
    </div>
  );
};

export default ProjectPage;
