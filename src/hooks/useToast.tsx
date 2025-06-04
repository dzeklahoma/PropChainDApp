import { useState, useCallback } from 'react';

export type ToastVariant = 'default' | 'success' | 'warning' | 'destructive';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

let toastCount = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, description, variant = 'default', duration = 5000 }: ToastOptions) => {
      const id = `toast-${toastCount++}`;
      const newToast = { id, title, description, variant };
      
      setToasts((currentToasts) => [...currentToasts, newToast]);
      
      if (duration > 0) {
        setTimeout(() => {
          setToasts((currentToasts) =>
            currentToasts.filter((toast) => toast.id !== id)
          );
        }, duration);
      }

      return id;
    },
    []
  );

  const remove = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  return { toasts, toast, remove };
}