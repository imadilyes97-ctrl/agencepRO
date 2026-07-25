"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--text-primary)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-[var(--radius-md)] border bg-[var(--bg-card)] px-3 py-2 text-sm",
            "placeholder:text-[var(--text-muted)]",
            "transition-colors duration-[var(--transition-fast)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-300)] focus-visible:border-[var(--color-primary-400)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]"
              : "border-[var(--border-primary)]",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[var(--text-muted)]">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, type InputProps };
