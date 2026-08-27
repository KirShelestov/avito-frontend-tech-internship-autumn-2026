import { forwardRef, useId, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { Field } from './Field';
import { StyledTextarea } from './Field.styles';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  fullWidth?: boolean;
  id?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
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
      <StyledTextarea
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
