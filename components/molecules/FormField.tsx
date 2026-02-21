import { ReactNode } from 'react';
import { FieldError } from '@/components/atoms/FieldError';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  children: ReactNode;
}

export function FormField({ label, error, required, helperText, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
        {required ? <span className="text-red-500 ml-1">*</span> : null}
      </label>
      {children}
      {helperText ? <p className="text-xs text-muted-foreground mt-1">{helperText}</p> : null}
      <FieldError message={error} />
    </div>
  );
}
