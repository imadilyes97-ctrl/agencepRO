"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] active:bg-[var(--color-primary-700)] shadow-[var(--shadow-sm)]",
  secondary:
    "bg-[var(--color-cream-200)] text-[var(--text-primary)] hover:bg-[var(--color-cream-300)] active:bg-[var(--color-cream-400)]",
  accent:
    "bg-[var(--color-accent-500)] text-white hover:bg-[var(--color-accent-600)] active:bg-[var(--color-accent-700)] shadow-[var(--shadow-sm)]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--color-cream-100)] active:bg-[var(--color-cream-200)]",
  danger:
    "bg-[var(--color-error)] text-white hover:bg-red-600 active:bg-red-700 shadow-[var(--shadow-sm)]",
  outline:
    "border border-[var(--border-primary)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--color-cream-100)] active:bg-[var(--color-cream-200)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium transition-colors duration-[var(--transition-fast)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-300)] focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
