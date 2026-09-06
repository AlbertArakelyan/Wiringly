import { type ChangeEvent, type FC } from 'react';
import { WtkButton, WtkInput } from 'wtk-ui-react';

import styles from './PinRow.module.css';
import type { IPinRowProps } from './types';

const PinRow: FC<IPinRowProps> = ({
  pin,
  leftModuleName,
  rightModuleName,
  onChangePin,
  onDelete,
  inputClassName = '',
  className = '',
  ...rest
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const side = event.currentTarget.name === 'rightPin' ? 'rightPin' : 'leftPin';

    onChangePin(pin.id, side, event.currentTarget.value);
  };

  return (
    <div className={`${styles.row} ${className}`} {...rest}>
      <WtkInput
        name="leftPin"
        placeholder={`${leftModuleName} pin`}
        value={pin.leftPin}
        autoComplete="off"
        wrapperClassName={`${styles.input} ${inputClassName}`}
        onChange={handleChange}
      />
      <span className={styles.arrow}>-&gt;</span>
      <WtkInput
        name="rightPin"
        placeholder={`${rightModuleName} pin`}
        value={pin.rightPin}
        autoComplete="off"
        wrapperClassName={`${styles.input} ${inputClassName}`}
        onChange={handleChange}
      />
      <WtkButton
        size="sm"
        variant="flat"
        title="Remove this pin"
        onClick={() => onDelete(pin.id)}
      >
        Remove
      </WtkButton>
    </div>
  );
};

export default PinRow;
