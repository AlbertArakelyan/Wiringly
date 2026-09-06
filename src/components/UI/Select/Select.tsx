import { type FC, useId, useMemo } from 'react';

import styles from './Select.module.css';
import type { ISelectProps, SelectSizeType } from './types';

const Select: FC<ISelectProps> = ({
  selectSize = 'md',
  label,
  options = [],
  placeholder,
  error,
  id,
  disabled,
  wrapperClassName = '',
  labelClassName = '',
  fieldClassName = '',
  errorClassName = '',
  className = '',
  ...rest
}) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  const selectSizeClass = useMemo(() => {
    const sizeMapping: Record<SelectSizeType, string> = {
      sm: styles.selectSm,
      md: styles.selectMd,
      lg: styles.selectLg,
    };

    return sizeMapping[selectSize] || sizeMapping.md;
  }, [selectSize]);

  const errorClass = error ? styles.selectError : '';

  return (
    <div className={`${styles.wrapper} ${wrapperClassName}`}>
      {label && (
        <label className={`${styles.label} ${labelClassName}`} htmlFor={selectId}>
          {label}
        </label>
      )}
      <div className={`${styles.field} ${fieldClassName}`}>
        <select
          id={selectId}
          className={`${styles.select} ${selectSizeClass} ${errorClass} ${className}`}
          disabled={disabled}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={styles.arrow} aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {error && <p className={`${styles.error} ${errorClassName}`}>{error}</p>}
    </div>
  );
};

export default Select;
