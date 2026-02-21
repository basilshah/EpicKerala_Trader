import { FileText, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileItem {
  url: string;
  filename: string;
  type: string;
}

interface FileListPreviewProps {
  files: FileItem[];
  onRemove: (index: number) => void;
  variant?: 'catalog' | 'certificate';
}

export function FileListPreview({ files, onRemove, variant = 'catalog' }: FileListPreviewProps) {
  if (!files.length) {
    return null;
  }

  const tone =
    variant === 'certificate'
      ? {
          wrapper: 'bg-purple-50 border-purple-200',
          icon: 'text-purple-500',
        }
      : {
          wrapper: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-500',
        };

  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <div
          key={`${file.url}-${index}`}
          className={cn(
            'flex items-center justify-between p-3 border rounded-lg',
            tone.wrapper
          )}
        >
          <div className="flex items-center gap-2">
            {file.type === 'application/pdf' ? (
              <FileText className="w-5 h-5 text-red-500" />
            ) : (
              <ImageIcon className={cn('w-5 h-5', tone.icon)} />
            )}
            <span className="text-sm text-slate-700">{file.filename}</span>
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
