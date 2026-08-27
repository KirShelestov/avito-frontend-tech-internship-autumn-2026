import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldError, FieldHint, FieldLabel, FieldRoot, RequiredMark } from './Field.styles';

export interface FieldProps {
  controlId: string;
  label?: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  fullWidth?: boolean;
  /** id подсказки, его нужно навесить на `aria-describedby` контрола */
  hintId?: string;
  /** id ошибки, его нужно навесить на `aria-describedby` контрола */
  errorId?: string;
  children: ReactNode;
  className?: string;
}

export function Field({
  controlId,
  label,
  required = false,
  hint,
  error,
  fullWidth = false,
  hintId,
  errorId,
  children,
  className,
}: FieldProps) {
  const { t } = useTranslation();

  return (
    <FieldRoot $fullWidth={fullWidth} className={className}>
      {label != null && (
        <FieldLabel htmlFor={controlId}>
          {label}
          {required && (
            <RequiredMark aria-label={t('field.required')} title={t('field.required')}>
              *
            </RequiredMark>
          )}
        </FieldLabel>
      )}
      {children}
      {hint != null && !error && <FieldHint id={hintId}>{hint}</FieldHint>}
      {error != null && (
        <FieldError id={errorId} role="alert">
          {error}
        </FieldError>
      )}
    </FieldRoot>
  );
}
