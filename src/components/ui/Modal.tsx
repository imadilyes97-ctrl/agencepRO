"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useCallback, useRef, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const maxWidthStyles: Record<string, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  open,
  onClose,
  children,
  title,
  description,
  maxWidth = "md",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        ref={contentRef}
        className={cn(
          "relative z-10 w-full mx-4 rounded-[var(--radius-lg)] border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-[var(--shadow-xl)]",
          "max-h-[90vh] overflow-y-auto",
          maxWidthStyles[maxWidth],
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-[var(--border-primary)] px-6 py-4">
            <div>
              {title && (
                <h2
                  id="modal-title"
                  className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[var(--text-primary)]"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-[var(--radius-md)] p-1 text-[var(--text-muted)] hover:bg-[var(--color-cream-100)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
