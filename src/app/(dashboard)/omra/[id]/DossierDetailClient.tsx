"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn, formatDZD, formatDate } from "@/lib/utils";
import { StatutBadge } from "@/components/omra/StatutBadge";
import { StatutDropdown } from "@/components/omra/StatutDropdown";
import { DossierTimeline } from "@/components/omra/DossierTimeline";
import {
  STATUT_LABELS,
  TYPE_DOSSIER_LABELS,
  DossierStatutEnum,
} from "@/schemas/dossier";
import type { z } from "zod";
import type {
  DossierStatut,
  TypeDossier,
  DocumentStatut,
  PaiementStatut,
  MethodePaiement,
  TypeDocument,
  VisaStatut,
  VolStatut,
  ClasseVol,
} from "@prisma/client";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Baby,
  Banknote,
  FileText,
  CreditCard,
  Plane,
  Hotel,
  Clock,
  ChevronRight,
  Download,
  ExternalLink,
} from "lucide-react";

// ── Serialized types ───────────────────────────────────────────

interface SerializedDossier {
  id: string;
  reference: string;
  intitule: string | null;
  destination: string;
  typeDossier: TypeDossier;
  statut: DossierStatut;
  dateDepart: string;
  dateRetour: string | null;
  nbAdultes: number;
  nbEnfants: number;
  nbBebes: number;
  montantTotal: number;
  montantPaye: number;
  montantRestant: number;
  devise: string;
  notes: string | null;
  tags: string[];
  createdAt: string;
  client: {
    id: string;
    nom: string;
    prenom: string;
    telephonePrincipal: string;
    telephoneSecondaire: string | null;
    email: string | null;
    civilite: string | null;
    nationalite: string;
    passeportNumero: string | null;
    passeportDateExpiration: string | null;
    cniNumero: string | null;
    cniDateExpiration: string | null;
  };
  groupe: {
    id: string;
    nom: string;
    statut: string;
    dateDepart: string;
    dateRetour: string | null;
    capaciteMax: number;
  } | null;
  programme: {
    id: string;
    nom: string;
    description: string | null;
    dateDepart: string;
    dateRetour: string;
    hotelNom: string | null;
    hotelEtoiles: number | null;
    nbNuits: number;
    prixParPersonne: number;
    visitesIncluses: string[];
  } | null;
  forfait: {
    id: string;
    nom: string;
    description: string | null;
    composants: unknown;
    prixTotal: number;
    devise: string;
  } | null;
  vol: {
    id: string;
    compagnie: string;
    numeroVol: string;
    depart: string;
    arrivee: string;
    dateDepart: string;
    dateArrivee: string;
    classe: ClasseVol;
    statut: VolStatut;
  } | null;
  hotel: {
    id: string;
    nom: string;
    ville: string;
    pays: string;
    etoiles: number | null;
  } | null;
  paiements: {
    id: string;
    montant: number;
    devise: string;
    methode: MethodePaiement;
    statut: PaiementStatut;
    datePaiement: string;
    reference: string | null;
  }[];
  documents: {
    id: string;
    type: TypeDocument;
    nomFichier: string;
    statut: DocumentStatut;
    dateExpiration: string | null;
    createdAt: string;
  }[];
  visa: {
    id: string;
    typeVisa: string;
    paysDestination: string;
    statut: VisaStatut;
    dateDepot: string | null;
    dateRetour: string | null;
    numeroVisa: string | null;
    fraisTotal: number;
  } | null;
  historiques: {
    id: string;
    action: string;
    ancienneValeur: Record<string, unknown> | null;
    nouvelleValeur: Record<string, unknown> | null;
    details: Record<string, unknown> | null;
    createdAt: string;
    user: { nom: string; prenom: string } | null;
  }[];
}

interface DossierDetailClientProps {
  dossier: SerializedDossier;
}

type TabKey = "documents" | "paiements" | "visa" | "vols";

const TABS: { key: TabKey; label: string; icon: typeof FileText }[] = [
  { key: "documents", label: "Documents", icon: FileText },
  { key: "paiements", label: "Paiements", icon: CreditCard },
  { key: "visa", label: "Visa", icon: FileText },
  { key: "vols", label: "Vols", icon: Plane },
];

// ── Helpers ────────────────────────────────────────────────────

function paiementStatutColor(statut: PaiementStatut) {
  const map: Record<PaiementStatut, string> = {
    EN_ATTENTE: "bg-amber-100 text-amber-700",
    CONFIRME: "bg-green-100 text-green-700",
    REJETTE: "bg-red-100 text-red-700",
    ANNULE: "bg-gray-100 text-gray-500",
    REMBOURSE: "bg-blue-100 text-blue-700",
  };
  return map[statut] ?? "bg-gray-100 text-gray-500";
}

function documentStatutColor(statut: DocumentStatut) {
  const map: Record<DocumentStatut, string> = {
    BROUILLON: "bg-gray-100 text-gray-500",
    EN_COURS_REVISION: "bg-amber-100 text-amber-700",
    VALIDE: "bg-green-100 text-green-700",
    REJETTE: "bg-red-100 text-red-700",
    EXPIRE: "bg-orange-100 text-orange-700",
  };
  return map[statut] ?? "bg-gray-100 text-gray-500";
}

function volStatutColor(statut: VolStatut) {
  const map: Record<VolStatut, string> = {
    PLANIFIE: "bg-blue-100 text-blue-700",
    CONFIRME: "bg-green-100 text-green-700",
    EN_COURS: "bg-amber-100 text-amber-700",
    ANNULE: "bg-red-100 text-red-700",
    RETARDE: "bg-orange-100 text-orange-700",
    TERMINE: "bg-gray-100 text-gray-500",
  };
  return map[statut] ?? "bg-gray-100 text-gray-500";
}

// ── Component ──────────────────────────────────────────────────

export function DossierDetailClient({ dossier }: DossierDetailClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("documents");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatutChange = useCallback(
    async (newStatut: DossierStatut, notes?: string) => {
      setIsUpdating(true);
      try {
        const res = await fetch(`/api/dossiers/${dossier.id}/statut`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statut: newStatut, notes }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Erreur lors du changement de statut");
        }

        router.refresh();
      } catch (error) {
        // Re-throw so StatutDropdown can handle it
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [dossier.id, router],
  );

  const totalVoyageurs = dossier.nbAdultes + dossier.nbEnfants + dossier.nbBebes;
  const paymentProgress =
    dossier.montantTotal > 0
      ? Math.round((dossier.montantPaye / dossier.montantTotal) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* ── Back link ── */}
      <Link
        href="/omra"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux dossiers
      </Link>

      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              {dossier.intitule ?? dossier.destination}
            </h1>
            <StatutBadge statut={dossier.statut} size="lg" />
          </div>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {dossier.reference} &middot;{" "}
            {TYPE_DOSSIER_LABELS[dossier.typeDossier as z.infer<typeof DossierStatutEnum>] ?? dossier.typeDossier} &middot;{" "}
            {dossier.client.prenom} {dossier.client.nom}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 opacity-60" />
              {formatDate(dossier.dateDepart)} {dossier.dateRetour ? `— ${formatDate(dossier.dateRetour)}` : ""}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 opacity-60" />
              {dossier.destination}
            </span>
          </div>
        </div>
        <div className="shrink-0">
          <StatutDropdown
            currentStatut={dossier.statut}
            onStatutChange={handleStatutChange}
            disabled={isUpdating}
          />
        </div>
      </div>

      {/* ── Info cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Client */}
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <h3 className="font-[family-name:var(--font-heading)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Client
          </h3>
          <p className="mt-2 font-[family-name:var(--font-heading)] text-lg font-semibold text-[var(--text-primary)]">
            {dossier.client.prenom} {dossier.client.nom}
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {dossier.client.telephonePrincipal}
          </p>
          {dossier.client.email && (
            <p className="text-sm text-[var(--text-secondary)]">{dossier.client.email}</p>
          )}
        </div>

        {/* Voyageurs */}
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <h3 className="font-[family-name:var(--font-heading)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Voyageurs
          </h3>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Users className="h-3.5 w-3.5 opacity-60" /> Adultes
              </span>
              <span className="font-medium text-[var(--text-primary)]">{dossier.nbAdultes}</span>
            </div>
            {dossier.nbEnfants > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <Users className="h-3.5 w-3.5 opacity-60" /> Enfants
                </span>
                <span className="font-medium text-[var(--text-primary)]">{dossier.nbEnfants}</span>
              </div>
            )}
            {dossier.nbBebes > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <Baby className="h-3.5 w-3.5 opacity-60" /> Bebes
                </span>
                <span className="font-medium text-[var(--text-primary)]">{dossier.nbBebes}</span>
              </div>
            )}
            <div className="border-t border-[var(--border-primary)] pt-1.5">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-[var(--text-primary)]">Total</span>
                <span className="text-[var(--text-primary)]">{totalVoyageurs}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Montants */}
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <h3 className="font-[family-name:var(--font-heading)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Montants
          </h3>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Total</span>
              <span className="font-medium text-[var(--text-primary)]">
                {formatDZD(dossier.montantTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Paye</span>
              <span className="font-medium text-green-600">{formatDZD(dossier.montantPaye)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Restant</span>
              <span
                className={cn(
                  "font-medium",
                  dossier.montantRestant > 0 ? "text-amber-600" : "text-green-600",
                )}
              >
                {formatDZD(dossier.montantRestant)}
              </span>
            </div>
            {/* Payment bar */}
            <div className="pt-1">
              <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-secondary)]">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    paymentProgress >= 100
                      ? "bg-green-500"
                      : paymentProgress >= 50
                        ? "bg-[var(--color-primary-500)]"
                        : "bg-amber-400",
                  )}
                  style={{ width: `${Math.min(paymentProgress, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-right text-[10px] text-[var(--text-muted)]">
                {paymentProgress}% paye
              </p>
            </div>
          </div>
        </div>

        {/* Programme / Forfait */}
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <h3 className="font-[family-name:var(--font-heading)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Programme
          </h3>
          {dossier.programme ? (
            <div className="mt-2 space-y-1">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {dossier.programme.nom}
              </p>
              {dossier.programme.hotelNom && (
                <p className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                  <Hotel className="h-3 w-3 opacity-60" />
                  {dossier.programme.hotelNom}
                  {dossier.programme.hotelEtoiles && (
                    <span>
                      {"★".repeat(dossier.programme.hotelEtoiles)}
                    </span>
                  )}
                </p>
              )}
              <p className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                <Clock className="h-3 w-3 opacity-60" />
                {dossier.programme.nbNuits} nuits
              </p>
            </div>
          ) : dossier.forfait ? (
            <div className="mt-2 space-y-1">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {dossier.forfait.nom}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {formatDZD(dossier.forfait.prixTotal)} /personne
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-[var(--text-muted)] italic">
              Aucun programme ou forfait attache
            </p>
          )}
          {dossier.groupe && (
            <div className="mt-3 border-t border-[var(--border-primary)] pt-2">
              <p className="text-xs text-[var(--text-muted)]">
                Groupe : <span className="font-medium text-[var(--text-secondary)]">{dossier.groupe.nom}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Notes ── */}
      {dossier.notes && (
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-[var(--text-primary)]">
            Notes
          </h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-secondary)]">
            {dossier.notes}
          </p>
        </div>
      )}

      {/* ── Timeline ── */}
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
        <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-[var(--text-primary)]">
          Historique
        </h3>
        <DossierTimeline entries={dossier.historiques} className="mt-4" />
      </div>

      {/* ── Tabs: Documents, Paiements, Visa, Vols ── */}
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)]">
        {/* Tab headers */}
        <div className="flex border-b border-[var(--border-primary)] overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const count =
              tab.key === "documents"
                ? dossier.documents.length
                : tab.key === "paiements"
                  ? dossier.paiements.length
                  : tab.key === "visa"
                    ? (dossier.visa ? 1 : 0)
                    : (dossier.vol ? 1 : 0);

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.key
                    ? "border-[var(--color-primary-500)] text-[var(--color-primary-500)]"
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]",
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {count > 0 && (
                  <span className="ml-1 rounded-full bg-[var(--bg-secondary)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-muted)]">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="p-4">
          {/* Documents tab */}
          {activeTab === "documents" && (
            <div>
              {dossier.documents.length === 0 ? (
                <p className="py-8 text-center text-sm text-[var(--text-muted)]">
                  Aucun document pour ce dossier
                </p>
              ) : (
                <div className="space-y-2">
                  {dossier.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-[var(--text-muted)]" />
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {doc.nomFichier}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {doc.type} &middot; {formatDate(doc.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                            documentStatutColor(doc.statut),
                          )}
                        >
                          {doc.statut.replace(/_/g, " ")}
                        </span>
                        <button
                          type="button"
                          className="rounded p-1 text-[var(--text-muted)] hover:bg-[var(--bg-primary)]"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Paiements tab */}
          {activeTab === "paiements" && (
            <div>
              {dossier.paiements.length === 0 ? (
                <p className="py-8 text-center text-sm text-[var(--text-muted)]">
                  Aucun paiement enregistre
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border-primary)]">
                        <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-muted)]">
                          Date
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-muted)]">
                          Montant
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-muted)]">
                          Methode
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-muted)]">
                          Reference
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-muted)]">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-primary)]">
                      {dossier.paiements.map((p) => (
                        <tr key={p.id}>
                          <td className="whitespace-nowrap px-3 py-2.5 text-[var(--text-secondary)]">
                            {formatDate(p.datePaiement)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5 font-medium text-[var(--text-primary)]">
                            {formatDZD(p.montant)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-[var(--text-secondary)]">
                            {p.methode.replace(/_/g, " ")}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-[var(--text-muted)]">
                            {p.reference ?? "—"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5">
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                paiementStatutColor(p.statut),
                              )}
                            >
                              {p.statut.replace(/_/g, " ")}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Visa tab */}
          {activeTab === "visa" && (
            <div>
              {!dossier.visa ? (
                <p className="py-8 text-center text-sm text-[var(--text-muted)]">
                  Aucun visa associe a ce dossier
                </p>
              ) : (
                <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-[family-name:var(--font-heading)] text-sm font-semibold text-[var(--text-primary)]">
                        Visa {dossier.visa.typeVisa}
                      </p>
                      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                        {dossier.visa.paysDestination}
                      </p>
                    </div>
                    <StatutBadge statut={dossier.visa.statut as DossierStatut} size="sm" />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    {dossier.visa.numeroVisa && (
                      <div>
                        <span className="text-xs text-[var(--text-muted)]">Numero</span>
                        <p className="font-medium text-[var(--text-primary)]">{dossier.visa.numeroVisa}</p>
                      </div>
                    )}
                    {dossier.visa.dateDepot && (
                      <div>
                        <span className="text-xs text-[var(--text-muted)]">Date de depot</span>
                        <p className="font-medium text-[var(--text-primary)]">{formatDate(dossier.visa.dateDepot)}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-xs text-[var(--text-muted)]">Frais total</span>
                      <p className="font-medium text-[var(--text-primary)]">{formatDZD(dossier.visa.fraisTotal)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Vols tab */}
          {activeTab === "vols" && (
            <div>
              {!dossier.vol ? (
                <p className="py-8 text-center text-sm text-[var(--text-muted)]">
                  Aucun vol associe a ce dossier
                </p>
              ) : (
                <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-[family-name:var(--font-heading)] text-sm font-semibold text-[var(--text-primary)]">
                        {dossier.vol.compagnie} — {dossier.vol.numeroVol}
                      </p>
                      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                        {dossier.vol.depart} → {dossier.vol.arrivee}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        volStatutColor(dossier.vol.statut),
                      )}
                    >
                      {dossier.vol.statut}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-[var(--text-muted)]">Depart</span>
                      <p className="font-medium text-[var(--text-primary)]">
                        {formatDate(dossier.vol.dateDepart)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-muted)]">Arrivee</span>
                      <p className="font-medium text-[var(--text-primary)]">
                        {formatDate(dossier.vol.dateArrivee)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-muted)]">Classe</span>
                      <p className="font-medium text-[var(--text-primary)]">{dossier.vol.classe}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
