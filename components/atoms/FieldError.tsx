interface FieldErrorProps {
  message?: string;
}

export function FieldError({ message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return <p className="text-red-600 text-sm mt-1">{message}</p>;
}
