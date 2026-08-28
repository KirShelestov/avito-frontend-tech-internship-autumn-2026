import { Clock } from 'lucide-react';
import { useEffect, useId, useState, type KeyboardEvent, type ReactNode } from 'react';
import { maskTimeInput, snapTime, stepTime, timeToMinutes } from '@/shared/lib/time';
import { Field } from '../field';
import { LeftIcon, Shell, StyledTimeInput } from './TimeField.styles';

export interface TimeFieldProps {
  value: string;
  /** Вызывается с валидным «HH:MM» или пустой строкой (после blur / стрелок) */
  onChange: (value: string) => void;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  step?: number;
  minTime?: string;
  maxTime?: string;
  placeholder?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

export function TimeField({
  value,
  onChange,
  label,
  hint,
  error,
  required,
  disabled,
  fullWidth = false,
  step = 15,
  minTime = '09:00',
  maxTime = '19:45',
  placeholder = 'чч:мм',
  id,
  className,
  'aria-label': ariaLabel,
}: TimeFieldProps) {
  const autoId = useId();
  const controlId = id ?? autoId;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  const minMinutes = timeToMinutes(minTime) ?? 0;
  const maxMinutes = timeToMinutes(maxTime) ?? 24 * 60 - step;

  const [draft, setDraft] = useState(value);
  useEffect(() => {
    setDraft(value);
  }, [value]);

  const emit = (next: string) => {
    setDraft(next);
    onChange(next);
  };

  const commit = (raw: string) => {
    if (raw.trim() === '') {
      emit('');
      return;
    }
    emit(snapTime(raw, step, minMinutes, maxMinutes));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    const base = timeToMinutes(draft) === null ? minTime : draft;
    emit(stepTime(base, event.key === 'ArrowUp' ? 1 : -1, step, minMinutes, maxMinutes));
  };

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
      <Shell $fullWidth={fullWidth}>
        <LeftIcon aria-hidden="true">
          <Clock size={16} />
        </LeftIcon>
        <StyledTimeInput
          id={controlId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholder}
          value={draft}
          disabled={disabled}
          required={required}
          maxLength={5}
          $invalid={Boolean(error)}
          aria-label={ariaLabel}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(event) => {
            setDraft(maskTimeInput(event.target.value));
          }}
          onBlur={(event) => {
            commit(event.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
      </Shell>
    </Field>
  );
}
