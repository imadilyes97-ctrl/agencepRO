import { cn } from "@/lib/utils";

// ============================================================
// Avatar — User avatar with initials fallback
// ============================================================

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
} as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary-100)] font-[family-name:var(--font-heading)] font-semibold text-[var(--color-primary-600)] select-none",
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
      <span className="sr-only">{name}</span>
    </div>
  );
}
