import { ChevronDown } from 'lucide-react';
import { forwardRef, useId, useState, type ReactNode, type SelectHTMLAttributes } from 'react';
import { Field } from '../field';
import { NativeSelect, SelectShell, Value } from './Select.styles';

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
  hideChevron?: boolean;
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
    hideChevron = false,
    placeholder,
    required,
    className,
    id,
    value,
    defaultValue,
    onChange,
    disabled = false,
    ...rest
  },
  ref,
) {
  const [innerValue, setInnerValue] = useState(() =>
    String(defaultValue ?? (placeholder != null ? '' : (options[0]?.value ?? ''))),
  );
  const current = value !== undefined ? String(value) : innerValue;
  const selected = options.find((option) => option.value === current);
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
      <SelectShell $fullWidth={fullWidth} $invalid={Boolean(error)} $disabled={disabled}>
        {leftIcon}
        <Value aria-hidden="true" $placeholder={!selected}>
          {selected?.label ?? placeholder}
        </Value>
        {!hideChevron && <ChevronDown size={16} strokeWidth={2.5} aria-hidden="true" />}
        <NativeSelect
          ref={ref}
          id={controlId}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          required={required}
          onChange={(event) => {
            setInnerValue(event.target.value);
            onChange?.(event);
          }}
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
      </SelectShell>
    </Field>
  );
});
