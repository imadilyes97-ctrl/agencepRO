"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  STATUT_COLORS,
  STATUT_LABELS,
  STATUT_TRANSITIONS,
  type DossierStatutEnum,
} from "@/schemas/dossier";
import type { DossierStatut } from "@prisma/client";
import { ChevronDown, Check, Loader2 } from "lucide-react";

interface StatutDropdownProps {
  currentStatut: DossierStatut;
  onStatutChange: (newStatut: DossierStatut, notes?: string) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export function StatutDropdown({
  currentStatut,
  onStatutChange,
  disabled = false,
  className,
}: StatutDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingStatut, setPendingStatut] = useState<DossierStatut | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [selectedForNotes, setSelectedForNotes] = useState<DossierStatut | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const validTransitions = STATUT_TRANSITIONS[currentStatut as DossierStatutEnum];
  const currentColors = STATUT_COLORS[currentStatut as DossierStatutEnum];
  const currentLabel = STATUT_LABELS[currentStatut as DossierStatutEnum] ?? currentStatut;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowNotes(false);
        setNotes("");
        setSelectedForNotes(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    async (newStatut: DossierStatut) => {
      // Some transitions benefit from requiring notes
      const requiresNotes = ["REFUSE", "ANNULE", "PROBLEME"].includes(newStatut);

      if (requiresNotes && !showNotes) {
        setSelectedForNotes(newStatut);
        setShowNotes(true);
        return;
      }

      setIsLoading(true);
      setPendingStatut(newStatut);
      try {
        await onStatutChange(newStatut, notes || undefined);
        setIsOpen(false);
        setShowNotes(false);
        setNotes("");
        setSelectedForNotes(null);
      } catch {
        // Error handled by parent
      } finally {
        setIsLoading(false);
        setPendingStatut(null);
      }
    },
    [onStatutChange, notes, showNotes],
  );

  const handleNotesSubmit = useCallback(() => {
    if (selectedForNotes) {
      handleSelect(selectedForNotes);
    }
  }, [selectedForNotes, handleSelect]);

  if (validTransitions.length === 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
          currentColors.bg,
          currentColors.text,
          "cursor-default",
          className,
        )}
      >
        {currentLabel}
      </span>
    );
  }

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
          "ring-1 ring-inset transition-colors",
          "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)]",
          currentColors.bg,
          currentColors.text,
          currentColors.ring,
          (disabled || isLoading) && "cursor-not-allowed opacity-50",
        )}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
            {currentLabel}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                isOpen && "rotate-180",
              )}
            />
          </>
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-lg">
          <div className="border-b border-[var(--border-primary)] px-3 py-2">
            <p className="text-xs font-medium text-[var(--text-muted)]">
              Changer le statut
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto p-1">
            {validTransitions.map((transition) => {
              const colors = STATUT_COLORS[transition as DossierStatutEnum];
              const label = STATUT_LABELS[transition as DossierStatutEnum] ?? transition;
              const isPending = pendingStatut === transition;

              return (
                <button
                  key={transition}
                  type="button"
                  onClick={() => handleSelect(transition as DossierStatut)}
                  disabled={isLoading}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm",
                    "transition-colors hover:bg-[var(--bg-secondary)]",
                    "disabled:opacity-50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      colors.bg,
                    )}
                  >
                    <span
                      className={cn("h-2 w-2 rounded-full", colors.text.replace("text-", "bg-"))}
                    />
                  </span>
                  <span className="flex-1 font-medium text-[var(--text-primary)]">
                    {label}
                  </span>
                  {isPending && <Loader2 className="h-4 w-4 animate-spin text-[var(--text-muted)]" />}
                </button>
              );
            })}
          </div>

          {/* Notes input for certain transitions */}
          {showNotes && selectedForNotes && (
            <div className="border-t border-[var(--border-primary)] p-3">
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">
                {selectedForNotes === "REFUSE"
                  ? "Motif du refus"
                  : selectedForNotes === "ANNULE"
                    ? "Raison de l'annulation"
                    : "Description du probleme"}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={cn(
                  "w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)]",
                  "px-3 py-2 text-sm text-[var(--text-primary)]",
                  "placeholder:text-[var(--text-muted)]",
                  "focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-500)]",
                )}
                placeholder="Notes optionnelles..."
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotes(false);
                    setNotes("");
                    setSelectedForNotes(null);
                  }}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleNotesSubmit}
                  disabled={isLoading}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                    "bg-[var(--color-primary-500)] text-white",
                    "hover:bg-[var(--color-primary-600)] disabled:opacity-50",
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                  Confirmer
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
