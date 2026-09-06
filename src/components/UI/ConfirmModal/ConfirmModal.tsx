import { type FC } from 'react';
import { WtkButton, WtkModal } from 'wtk-ui-react';

import styles from './ConfirmModal.module.css';
import type { IConfirmModalProps } from './types';

const ConfirmModal: FC<IConfirmModalProps> = ({
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onClose,
  messageClassName = '',
  size = 'sm',
  ...rest
}) => (
  <WtkModal
    size={size}
    onClose={onClose}
    footer={
      <>
        <WtkButton onClick={onClose}>{cancelLabel}</WtkButton>
        <WtkButton variant={isDestructive ? 'destructive' : 'suggested'} onClick={onConfirm}>
          {confirmLabel}
        </WtkButton>
      </>
    }
    {...rest}
  >
    <p className={`${styles.message} ${messageClassName}`}>{message}</p>
  </WtkModal>
);

export default ConfirmModal;
