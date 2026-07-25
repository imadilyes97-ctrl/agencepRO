"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { type ReactNode, type MouseEvent } from "react";

// ── Types ─────────────────────────────────────────────────────

export type SortDirection = "asc" | "desc";

export interface Column<T> {
  /** Unique key used for sorting (must match a key on T or be a custom accessorKey). */
  key: string;
  /** Header label. */
  label: string;
  /** Whether this column is sortable. */
  sortable?: boolean;
  /** Custom render function. Falls back to String(value). */
  render?: (row: T, index: number) => ReactNode;
  /** Tailwind classes for the column cell. */
  className?: string;
  /** Custom accessor to extract a value for sorting (when data is nested). */
  accessor?: (row: T) => string | number | Date | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pagination: PaginationMeta;
  sortBy?: string;
  sortDir?: SortDirection;
  onSort?: (key: string) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  loading?: boolean;
  /** Unique key extractor for rows. */
  rowKey: (row: T) => string;
  /** Extra content rendered in the top bar (e.g. filters). */
  topBar?: ReactNode;
}

// ── Component ─────────────────────────────────────────────────

export function DataTable<T>({
  columns,
  data,
  pagination,
  sortBy,
  sortDir,
  onSort,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  emptyMessage = "Aucune donnee trouvee",
  loading = false,
  rowKey,
  topBar,
}: DataTableProps<T>) {
  const { total, page, pageSize, totalPages } = pagination;

  function handleSort(key: string) {
    if (!onSort) return;
    onSort(key);
  }

  function renderSortIcon(columnKey: string) {
    if (!onSort) return <ArrowUpDown className="h-3.5 w-3.5 opacity-30" />;
    if (sortBy !== columnKey) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-[var(--color-primary-500)]" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-[var(--color-primary-500)]" />
    );
  }

  return (
    <div className="space-y-3">
      {topBar}

      {/* Table */}
      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-primary)] bg-[var(--color-cream-50)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]",
                    col.sortable && onSort && "cursor-pointer select-none hover:text-[var(--text-primary)] transition-colors",
                    col.className,
                  )}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && renderSortIcon(col.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-[var(--text-muted)]">
                    <svg
                      className="h-5 w-5 animate-spin"
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
                    Chargement...
                  </div>
                </td>
              </tr>
            )}

            {!loading && data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-[var(--text-muted)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!loading &&
              data.map((row, rowIndex) => (
                <tr
                  key={rowKey(row)}
                  className={cn(
                    "border-b border-[var(--border-primary)] last:border-b-0 transition-colors",
                    onRowClick && "cursor-pointer hover:bg-[var(--color-cream-50)]",
                  )}
                  onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3 text-[var(--text-primary)]",
                        col.className,
                      )}
                    >
                      {col.render
                        ? col.render(row, rowIndex)
                        : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <span>
              Affichage de{" "}
              <span className="font-medium text-[var(--text-primary)]">
                {Math.min((page - 1) * pageSize + 1, total)}
              </span>{" "}
              a{" "}
              <span className="font-medium text-[var(--text-primary)]">
                {Math.min(page * pageSize, total)}
              </span>{" "}
              sur{" "}
              <span className="font-medium text-[var(--text-primary)]">{total}</span>
            </span>
            {onPageSizeChange && (
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="ml-2 rounded-[var(--radius-md)] border border-[var(--border-primary)] bg-[var(--bg-card)] px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-300)]"
              >
                {[10, 25, 50, 100].map((s) => (
                  <option key={s} value={s}>
                    {s} / page
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-1">
            <PaginationButton
              disabled={page <= 1}
              onClick={() => onPageChange?.(1)}
              ariaLabel="Premiere page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </PaginationButton>
            <PaginationButton
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
              ariaLabel="Page precedente"
            >
              <ChevronLeft className="h-4 w-4" />
            </PaginationButton>

            {/* Page numbers */}
            {generatePageNumbers(page, totalPages).map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-2 text-sm text-[var(--text-muted)]"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange?.(Number(p))}
                  className={cn(
                    "min-w-[36px] rounded-[var(--radius-md)] px-2 py-1.5 text-sm font-medium transition-colors",
                    Number(p) === page
                      ? "bg-[var(--color-primary-500)] text-white"
                      : "text-[var(--text-primary)] hover:bg-[var(--color-cream-100)]",
                  )}
                >
                  {p}
                </button>
              ),
            )}

            <PaginationButton
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
              ariaLabel="Page suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </PaginationButton>
            <PaginationButton
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(totalPages)}
              ariaLabel="Derniere page"
            >
              <ChevronsRight className="h-4 w-4" />
            </PaginationButton>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────

interface PaginationButtonProps {
  children: ReactNode;
  disabled: boolean;
  onClick: () => void;
  ariaLabel: string;
}

function PaginationButton({
  children,
  disabled,
  onClick,
  ariaLabel,
}: PaginationButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className="inline-flex min-w-[36px] items-center justify-center rounded-[var(--radius-md)] px-2 py-1.5 text-[var(--text-primary)] transition-colors hover:bg-[var(--color-cream-100)] disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function generatePageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  // Always show first page
  pages.push(1);

  if (current > 3) {
    pages.push("...");
  }

  // Show current and surrounding pages
  const rangeStart = Math.max(2, current - 1);
  const rangeEnd = Math.min(total - 1, current + 1);

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  // Always show last page
  pages.push(total);

  return pages;
}
