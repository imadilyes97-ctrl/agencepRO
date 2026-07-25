import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as DZD currency. */
export function formatDZD(amount: number): string {
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Generate a reference code: PREFIX-YYYY-NNNNNN */
export function generateRef(prefix: string, sequence: number): string {
  const year = new Date().getFullYear();
  const seq = String(sequence).padStart(6, "0");
  return `${prefix}-${year}-${seq}`;
}

/** Safe date formatting (returns null if invalid). */
export function formatDate(date: Date | string | null): string | null {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("fr-FR");
}

/** Truncate text with ellipsis. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}
