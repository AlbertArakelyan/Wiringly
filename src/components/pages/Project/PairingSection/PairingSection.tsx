import { type FC } from 'react';
import { WtkButton } from 'wtk-ui-react';

import PinRow from '../PinRow/PinRow';
import styles from './PairingSection.module.css';
import type { IPairingSectionProps } from './types';

const PairingSection: FC<IPairingSectionProps> = ({
  pairing,
  leftModuleName,
  rightModuleName,
  onAddPin,
  onChangePin,
  onDeletePin,
  onDeletePairing,
  titleClassName = '',
  rowsClassName = '',
  className = '',
  ...rest
}) => (
  <section className={`${styles.section} ${className}`} {...rest}>
    <div className={styles.header}>
      <h2 className={`${styles.title} ${titleClassName}`}>
        {leftModuleName} -&gt; {rightModuleName}
      </h2>
      <WtkButton
        size="sm"
        variant="flat"
        title="Remove this pairing"
        onClick={() => onDeletePairing(pairing.id)}
      >
        Remove
      </WtkButton>
    </div>

    {Boolean(pairing.pins.length) && (
      <div className={`${styles.rows} ${rowsClassName}`}>
        {pairing.pins.map((pin) => (
          <PinRow
            key={pin.id}
            pin={pin}
            leftModuleName={leftModuleName}
            rightModuleName={rightModuleName}
            onChangePin={(pinId, side, value) => onChangePin(pairing.id, pinId, side, value)}
            onDelete={(pinId) => onDeletePin(pairing.id, pinId)}
          />
        ))}
      </div>
    )}

    <div className={styles.footer}>
      <WtkButton onClick={() => onAddPin(pairing.id)}>Add</WtkButton>
    </div>
  </section>
);

export default PairingSection;
