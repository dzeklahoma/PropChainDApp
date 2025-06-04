import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useToast, Toast as ToastType } from '../../hooks/useToast';

const ToastVariantStyles = {
  default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  destructive: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
};

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

const Toast = ({ toast, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(toast.id), 300);
  };

  return (
    <div
      className={cn(
        'pointer-events-auto relative flex w-full max-w-md items-center justify-between overflow-hidden rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out',
        ToastVariantStyles[toast.variant || 'default'],
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      )}
    >
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{toast.title}</h3>
        {toast.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{toast.description}</p>
        )}
      </div>
      <button
        onClick={handleClose}
        className="ml-4 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
};

export function Toaster() {
  const { toasts, remove } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col-reverse md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={remove} />
      ))}
    </div>
  );
}