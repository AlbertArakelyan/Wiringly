import type { IWtkModalProps } from 'wtk-ui-react';

export interface IConfirmModalProps extends Omit<IWtkModalProps, 'children' | 'footer'> {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  messageClassName?: string;
}
