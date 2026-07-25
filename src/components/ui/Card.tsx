import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("border-b border-[var(--border-primary)] px-6 py-4", className)}>
      {children}
    </div>
  );
}

function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3
      className={cn(
        "font-[family-name:var(--font-heading)] text-lg font-semibold text-[var(--text-primary)]",
        className,
      )}
    >
      {children}
    </h3>
  );
}

function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn("mt-1 text-sm text-[var(--text-muted)]", className)}>
      {children}
    </p>
  );
}

function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}

function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={cn(
        "border-t border-[var(--border-primary)] px-6 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
