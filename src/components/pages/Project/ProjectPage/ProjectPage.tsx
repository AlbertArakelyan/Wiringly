import { type FC, useState } from 'react';
import { WtkButton } from 'wtk-ui-react';

import { exportWiring } from '../../../../export/wiringExport';
import type { IPin, PinSideType } from '../../../../storage/types';
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
  onChangeProject,
  onBack,
  contentClassName = '',
  className = '',
  ...rest
}) => {
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);
  const [deletedModuleId, setDeletedModuleId] = useState('');
  const [exportError, setExportError] = useState('');

  const moduleName = (id: string) =>
    project.modules.find((module) => module.id === id)?.name ?? '';

  const deletedModule = project.modules.find((module) => module.id === deletedModuleId);
  const pairingsUsingDeletedModule = project.pairings.filter(
    (pairing) =>
      pairing.leftModuleId === deletedModuleId || pairing.rightModuleId === deletedModuleId,
  );

  const updatePairings = (pairings: typeof project.pairings) =>
    onChangeProject({ ...project, pairings });

  const handleAddModule = (name: string) =>
    onChangeProject({
      ...project,
      modules: [...project.modules, { id: crypto.randomUUID(), name }],
    });

  const handleDeleteModule = () => {
    onChangeProject({
      ...project,
      modules: project.modules.filter((module) => module.id !== deletedModuleId),
      // a pairing cannot survive losing one of its two sides
      pairings: project.pairings.filter(
        (pairing) =>
          pairing.leftModuleId !== deletedModuleId && pairing.rightModuleId !== deletedModuleId,
      ),
    });

    setDeletedModuleId('');
  };

  const handleAddPairing = (leftModuleId: string, rightModuleId: string) => {
    updatePairings([
      ...project.pairings,
      { id: crypto.randomUUID(), leftModuleId, rightModuleId, pins: [] },
    ]);

    setIsPairingModalOpen(false);
  };

  const handleAddPin = (pairingId: string) => {
    const pin: IPin = { id: crypto.randomUUID(), leftPin: '', rightPin: '' };

    updatePairings(
      project.pairings.map((pairing) =>
        pairing.id === pairingId ? { ...pairing, pins: [...pairing.pins, pin] } : pairing,
      ),
    );
  };

  const handleChangePin = (
    pairingId: string,
    pinId: string,
    side: PinSideType,
    value: string,
  ) =>
    updatePairings(
      project.pairings.map((pairing) =>
        pairing.id === pairingId
          ? {
              ...pairing,
              pins: pairing.pins.map((pin) =>
                pin.id === pinId ? { ...pin, [side]: value } : pin,
              ),
            }
          : pairing,
      ),
    );

  const handleDeletePin = (pairingId: string, pinId: string) =>
    updatePairings(
      project.pairings.map((pairing) =>
        pairing.id === pairingId
          ? { ...pairing, pins: pairing.pins.filter((pin) => pin.id !== pinId) }
          : pairing,
      ),
    );

  const handleDeletePairing = (pairingId: string) =>
    updatePairings(project.pairings.filter((pairing) => pairing.id !== pairingId));

  const handleExport = async () => {
    try {
      await exportWiring(project);
      setExportError('');
    } catch (error: unknown) {
      setExportError(
        error instanceof Error ? `Export failed: ${error.message}` : 'Export failed.',
      );
    }
  };

  return (
    <div className={`${styles.page} ${className}`} {...rest}>
      <HeaderBar
        title={project.name}
        leading={<WtkButton onClick={onBack}>Back</WtkButton>}
        actions={
          <>
            <WtkButton
              disabled={project.modules.length < 2}
              title={
                project.modules.length < 2 ? 'Add two modules first' : 'Pair two modules up'
              }
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

      {exportError && <p className={styles.error}>{exportError}</p>}

      <div className={`${styles.content} ${contentClassName}`}>
        <ModulesPanel
          modules={project.modules}
          onAddModule={handleAddModule}
          onDeleteModule={setDeletedModuleId}
        />

        {project.pairings.length ? (
          <div className={styles.pairings}>
            {project.pairings.map((pairing) => (
              <PairingSection
                key={pairing.id}
                pairing={pairing}
                leftModuleName={moduleName(pairing.leftModuleId)}
                rightModuleName={moduleName(pairing.rightModuleId)}
                onAddPin={handleAddPin}
                onChangePin={handleChangePin}
                onDeletePin={handleDeletePin}
                onDeletePairing={handleDeletePairing}
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
            pairingsUsingDeletedModule.length
              ? `Remove "${deletedModule.name}"? Its ${pairingsUsingDeletedModule.length === 1 ? 'pairing goes' : 'pairings go'} with it.`
              : `Remove "${deletedModule.name}"?`
          }
          confirmLabel="Remove"
          onConfirm={handleDeleteModule}
          onClose={() => setDeletedModuleId('')}
        />
      )}
    </div>
  );
};

export default ProjectPage;
