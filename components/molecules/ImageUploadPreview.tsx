import { X } from 'lucide-react';

interface ImageUploadItem {
  url: string;
  filename: string;
}

interface ImageUploadPreviewProps {
  images: ImageUploadItem[];
  onRemove: (index: number) => void;
}

export function ImageUploadPreview({ images, onRemove }: ImageUploadPreviewProps) {
  if (!images.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <div key={`${image.url}-${index}`} className="relative group">
          <img
            src={image.url}
            alt={image.filename}
            className="w-full h-32 object-cover rounded-lg border-2 border-slate-200"
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-xs text-slate-600 mt-1 truncate">{image.filename}</p>
        </div>
      ))}
    </div>
  );
}
