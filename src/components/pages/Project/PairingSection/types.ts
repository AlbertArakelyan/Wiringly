import type { HTMLAttributes } from 'react';

import type { IPairing, PinSideType } from '../../../../storage/types';

export interface IPairingSectionProps extends HTMLAttributes<HTMLElement> {
  pairing: IPairing;
  leftModuleName: string;
  rightModuleName: string;
  onAddPin: (pairingId: string) => void;
  onChangePin: (pairingId: string, pinId: string, side: PinSideType, value: string) => void;
  onDeletePin: (pairingId: string, pinId: string) => void;
  onDeletePairing: (pairingId: string) => void;
  titleClassName?: string;
  rowsClassName?: string;
}
