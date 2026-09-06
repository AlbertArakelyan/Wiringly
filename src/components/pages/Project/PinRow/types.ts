import type { HTMLAttributes } from 'react';

import type { IPin, PinSideType } from '../../../../storage/types';

export interface IPinRowProps extends HTMLAttributes<HTMLDivElement> {
  pin: IPin;
  leftModuleName: string;
  rightModuleName: string;
  // not `onChange`: HTMLAttributes already uses that for the DOM change event
  onChangePin: (pinId: string, side: PinSideType, value: string) => void;
  onDelete: (pinId: string) => void;
  inputClassName?: string;
}
