import { ChevronDown } from 'lucide-react';
import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from 'react';
import { Field } from '../field';
import { LeftIcon, NativeSelect, SelectShell } from './Select.styles';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'id' | 'children'
> {
  options: SelectOption[];
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  /** Плейсхолдер-опция (value = '') */
  placeholder?: string;
  id?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    options,
    label,
    hint,
    error,
    fullWidth = false,
    leftIcon,
    placeholder,
    required,
    className,
    id,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const controlId = id ?? autoId;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <Field
      controlId={controlId}
      label={label}
      required={required}
      hint={hint}
      error={error}
      hintId={hintId}
      errorId={errorId}
      fullWidth={fullWidth}
      className={className}
    >
      <SelectShell $fullWidth={fullWidth} $invalid={Boolean(error)}>
        {leftIcon != null && <LeftIcon aria-hidden="true">{leftIcon}</LeftIcon>}
        <NativeSelect
          ref={ref}
          id={controlId}
          $invalid={Boolean(error)}
          $hasLeftIcon={leftIcon != null}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          required={required}
          {...rest}
        >
          {placeholder != null && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </NativeSelect>
        <ChevronDown size={18} aria-hidden="true" />
      </SelectShell>
    </Field>
  );
});
