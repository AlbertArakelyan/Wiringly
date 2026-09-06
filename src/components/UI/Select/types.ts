import type { SelectHTMLAttributes } from 'react';

export type SelectSizeType = 'sm' | 'md' | 'lg';

export interface ISelectOption {
  value: string;
  label: string;
}

// not `size`: SelectHTMLAttributes already uses that for the visible row count
export interface ISelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  selectSize?: SelectSizeType;
  label?: string;
  options?: ISelectOption[];
  placeholder?: string;
  error?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  fieldClassName?: string;
  errorClassName?: string;
}
