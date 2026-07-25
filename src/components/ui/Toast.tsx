"use client";

import { Toaster, toast } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-primary)",
        },
      }}
    />
  );
}

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },
  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, { description });
  },
  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
  ) => {
    return toast.promise(promise, messages);
  },
};
