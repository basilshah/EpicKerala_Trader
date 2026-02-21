import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChangeEvent } from 'react';

interface FileUploadFieldProps {
  inputId: string;
  label: string;
  accept: string;
  uploading?: boolean;
  uploadingText?: string;
  idleText: string;
  helperText?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  tone?: 'green' | 'blue' | 'purple';
}

export function FileUploadField({
  inputId,
  label,
  accept,
  uploading,
  uploadingText = 'Uploading...',
  idleText,
  helperText,
  onChange,
  tone = 'green',
}: FileUploadFieldProps) {
  const toneClass =
    tone === 'purple'
      ? 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300'
      : tone === 'blue'
        ? 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300'
        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-300';

  return (
    <div>
      <label htmlFor={inputId} className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors border', toneClass)}>
        <Upload className="w-4 h-4" />
        {uploading ? uploadingText : idleText}
      </label>
      <input
        id={inputId}
        aria-label={label}
        type="file"
        accept={accept}
        onChange={onChange}
        disabled={uploading}
        className="hidden"
      />
      {helperText ? <p className="text-xs text-slate-500 mt-1">{helperText}</p> : null}
    </div>
  );
}
