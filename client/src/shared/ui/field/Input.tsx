import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { Field } from './Field';
import { StyledInput } from './Field.styles';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  fullWidth?: boolean;
  id?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, fullWidth = false, required, className, id, ...rest },
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
      <StyledInput
        ref={ref}
        id={controlId}
        $invalid={Boolean(error)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        required={required}
        {...rest}
      />
    </Field>
  );
});
