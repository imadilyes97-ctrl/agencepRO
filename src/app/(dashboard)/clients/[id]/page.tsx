"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Plane,
  FileText,
  CreditCard,
  History,
  StickyNote,
  Calendar,
  User,
  Star,
  Upload,
  Download,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge, statutBadgeVariant, statutLabel } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { showToast } from "@/components/ui/Toast";
import {
  dossierStatutBadgeVariant,
  dossierStatutLabel,
} from "@/components/ui/Badge";
import { formatDate, formatDZD } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────

type TabId = "dossiers" | "documents" | "paiements" | "historique" | "notes";

interface ClientData {
  id: string;
  numeroClient: string;
  civilite: string | null;
  nom: string;
  prenom: string;
  telephonePrincipal: string;
  telephoneSecondaire: string | null;
  email: string | null;
  dateNaissance: string | null;
  lieuNaissance: string | null;
  sexe: string | null;
  nationalite: string;
  adresseComplete: string | null;
  wilaya: string | null;
  commune: string | null;
  codePostal: string | null;
  photoProfil: string | null;
  statut: string;
  sourceAcquisition: string | null;
  notes: string | null;
  tags: string[];
  segments: string[];
  scoreFidelite: number;
  niveauFidelite: string | null;
  nombreVoyages: number;
  montantTotalDepense: number;
  dernierVoyageDate: string | null;
  assigneA: string | null;
  createdAt: string;
  updatedAt: string;
  cniNumero: string | null;
  passeportNumero: string | null;
  dossiers: DossierSummary[];
  documents: DocumentSummary[];
  factures: FactureSummary[];
  paiements: PaiementSummary[];
  historiques: HistoriqueEntry[];
  contacts: ContactEntry[];
}

interface DossierSummary {
  id: string;
  typeDossier: string;
  statut: string;
  dateDepart: string;
  dateRetour: string | null;
  montantTotal: number;
  montantPaye: number;
  devise: string;
  createdAt: string;
}

interface DocumentSummary {
  id: string;
  type: string;
  nomFichier: string;
  statut: string;
  taille: number | null;
  mimeType: string | null;
  dateExpiration: string | null;
  createdAt: string;
}

interface FactureSummary {
  id: string;
  numero: string;
  statut: string;
  total: number;
  devise: string;
  dateEmission: string;
  dateEcheance: string;
}

interface PaiementSummary {
  id: string;
  montant: number;
  devise: string;
  methode: string;
  statut: string;
  datePaiement: string;
}

interface HistoriqueEntry {
  id: string;
  action: string;
  entityType: string;
  ancienneValeur: unknown;
  nouvelleValeur: unknown;
  details: unknown;
  succes: boolean;
  createdAt: string;
  user: { nom: string; prenom: string } | null;
}

interface ContactEntry {
  id: string;
  nom: string;
  lien: string;
  telephone: string;
  email: string | null;
}

// ── Constants ─────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: typeof Plane }[] = [
  { id: "dossiers", label: "Dossiers", icon: Plane },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "paiements", label: "Paiements", icon: CreditCard },
  { id: "historique", label: "Historique", icon: History },
  { id: "notes", label: "Notes", icon: StickyNote },
];

function actionLabel(action: string): string {
  const labels: Record<string, string> = {
    CREATION: "Creation",
    MODIFICATION: "Modification",
    DESACTIVATION: "Desactivation",
    CONNEXION: "Connexion",
    EXPORT: "Export",
    VALIDATION: "Validation",
  };
  return labels[action] ?? action;
}

function actionBadgeColor(action: string): "success" | "info" | "warning" | "danger" | "default" {
  switch (action) {
    case "CREATION":
      return "success";
    case "MODIFICATION":
      return "info";
    case "DESACTIVATION":
      return "danger";
    default:
      return "default";
  }
}

function formatFileSize(bytes: number | null): string {
  if (bytes === null) return "-";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function documentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    PASSEPORT: "Passeport",
    CNI: "CNI",
    VISA: "Visa",
    PHOTO_IDENTITE: "Photo identite",
    CERTIFICAT_VACCINATION: "Certificat vaccination",
    ATTESTATION_EMPLOI: "Attestation d'emploi",
    RELEVE_BANCAIRE: "Releve bancaire",
    ASSURANCE_VOYAGE: "Assurance voyage",
    CONTRAT: "Contrat",
    FACTURE: "Facture",
    BILLET_AVION: "Billet d'avion",
    RESERVATION_HOTEL: "Reservation hotel",
    AUTRE: "Autre",
  };
  return labels[type] ?? type;
}

function dossierTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    OMRA: "Omra",
    HAJJ: "Hajj",
    TOURISME: "Tourisme",
    VISA: "Visa",
    CRUISE: "Cruise",
    GROUPE: "Groupe",
  };
  return labels[type] ?? type;
}

function paiementStatutLabel(statut: string): "success" | "warning" | "danger" | "info" | "default" {
  switch (statut) {
    case "CONFIRME":
      return "success";
    case "EN_ATTENTE":
      return "warning";
    case "REJETTE":
    case "ANNULE":
      return "danger";
    case "REMBOURSE":
      return "info";
    default:
      return "default";
  }
}

function factureStatutLabel(statut: string): "success" | "warning" | "danger" | "info" | "default" {
  switch (statut) {
    case "PAYEE":
    case "VALIDEE":
      return "success";
    case "BROUILLON":
    case "EMISE":
      return "info";
    case "EN_RETARD":
    case "IMPAYEE":
      return "danger";
    case "PARTIELLEMENT_PAYEE":
      return "warning";
    default:
      return "default";
  }
}

// ── Component ─────────────────────────────────────────────────

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: clientId } = use(params);
  const router = useRouter();
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("dossiers");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch client data ─────────────────────────────────────

  const fetchClient = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/clients/${clientId}`);
      const json = await res.json();

      if (json.success && json.data) {
        setClient(json.data as ClientData);
      } else {
        showToast.error("Erreur", json.error || "Client introuvable");
        router.push("/clients");
      }
    } catch {
      showToast.error("Erreur reseau", "Impossible de charger le client");
    } finally {
      setLoading(false);
    }
  }, [clientId, router]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  // ── Delete handler ────────────────────────────────────────

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (json.success) {
        showToast.success("Client desactive", "Le client a ete desactive avec succes");
        router.push("/clients");
      } else {
        showToast.error("Erreur", json.error || "Impossible de supprimer le client");
      }
    } catch {
      showToast.error("Erreur reseau", "Impossible de contacter le serveur");
    } finally {
      setDeleting(false);
    }
  }

  // ── Loading state ─────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-[var(--text-muted)]">
          <svg
            className="h-6 w-6 animate-spin"
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
          Chargement du dossier client...
        </div>
      </div>
    );
  }

  if (!client) return null;

  const totalFactures = client.factures.reduce((s, f) => s + Number(f.total), 0);
  const totalPaye = client.paiements
    .filter((p) => p.statut === "CONFIRME")
    .reduce((s, p) => s + Number(p.montant), 0);
  const soldeRestant = totalFactures - totalPaye;

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push("/clients")}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour a la liste
      </button>

      {/* Client Header */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Avatar + identity */}
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-500)] text-xl font-bold text-white">
                {client.prenom.charAt(0)}
                {client.nom.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--text-primary)]">
                    {client.civilite === "MONSIEUR"
                      ? "M."
                      : client.civilite === "MADAME"
                        ? "Mme"
                        : client.civilite === "MADEMOISELLE"
                          ? "Mlle"
                          : ""}{" "}
                    {client.prenom} {client.nom}
                  </h1>
                  <Badge variant={statutBadgeVariant(client.statut)} size="sm">
                    {statutLabel(client.statut)}
                  </Badge>
                </div>
                <p className="mt-0.5 font-mono text-xs text-[var(--text-muted)]">
                  {client.numeroClient}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {client.telephonePrincipal}
                  </span>
                  {client.email && (
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      {client.email}
                    </span>
                  )}
                  {client.wilaya && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {client.commune ? `${client.commune}, ` : ""}
                      {client.wilaya}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
                Modifier
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteModalOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Desactiver
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats sidebar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-primary-50)]">
              <Plane className="h-5 w-5 text-[var(--color-primary-500)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Voyages</p>
              <p className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text-primary)]">
                {client.nombreVoyages}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-accent-50)]">
              <CreditCard className="h-5 w-5 text-[var(--color-accent-500)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Total depense</p>
              <p className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text-primary)]">
                {formatDZD(Number(client.montantTotalDepense))}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-green-50">
              <Star className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Fidelite</p>
              <p className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text-primary)]">
                {client.scoreFidelite}
              </p>
              {client.niveauFidelite && (
                <p className="text-[10px] text-[var(--text-muted)]">
                  {client.niveauFidelite}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-amber-50">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Dernier voyage</p>
              <p className="font-[family-name:var(--font-heading)] text-sm font-bold text-[var(--text-primary)]">
                {formatDate(client.dernierVoyageDate) ?? "Aucun"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border-primary)]">
        <nav className="-mb-px flex gap-0 overflow-x-auto" aria-label="Sections">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-[var(--color-primary-500)] text-[var(--color-primary-500)]"
                    : "border-transparent text-[var(--text-muted)] hover:border-[var(--border-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.id === "dossiers" && (
                  <span
                    className={`ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-[var(--color-primary-100)] text-[var(--color-primary-500)]"
                        : "bg-[var(--color-cream-200)] text-[var(--text-muted)]"
                    }`}
                  >
                    {client.dossiers.length}
                  </span>
                )}
                {tab.id === "documents" && (
                  <span
                    className={`ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-[var(--color-primary-100)] text-[var(--color-primary-500)]"
                        : "bg-[var(--color-cream-200)] text-[var(--text-muted)]"
                    }`}
                  >
                    {client.documents.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {/* ── DOSSIERS TAB ─────────────────────────────────── */}
        {activeTab === "dossiers" && (
          <div className="space-y-4">
            {client.dossiers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Plane className="h-10 w-10 text-[var(--color-cream-400)]" />
                  <p className="mt-3 text-sm text-[var(--text-muted)]">
                    Aucun dossier pour ce client
                  </p>
                </CardContent>
              </Card>
            ) : (
              client.dossiers.map((dossier) => (
                <Card key={dossier.id}>
                  <CardContent className="py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-primary-50)]">
                          <Plane className="h-5 w-5 text-[var(--color-primary-500)]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-[var(--text-primary)]">
                              {dossierTypeLabel(dossier.typeDossier)}
                            </p>
                            <Badge
                              variant={dossierStatutBadgeVariant(dossier.statut)}
                              size="sm"
                            >
                              {dossierStatutLabel(dossier.statut)}
                            </Badge>
                          </div>
                          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                            {formatDate(dossier.dateDepart)}
                            {dossier.dateRetour &&
                              ` - ${formatDate(dossier.dateRetour)}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-[family-name:var(--font-heading)] text-sm font-semibold text-[var(--text-primary)]">
                          {formatDZD(Number(dossier.montantTotal))}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          Paye: {formatDZD(Number(dossier.montantPaye))}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* ── DOCUMENTS TAB ────────────────────────────────── */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--text-muted)]">
                {client.documents.length} document(s)
              </p>
              <Button size="sm" variant="outline">
                <Upload className="h-4 w-4" />
                Ajouter
              </Button>
            </div>

            {client.documents.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-10 w-10 text-[var(--color-cream-400)]" />
                  <p className="mt-3 text-sm text-[var(--text-muted)]">
                    Aucun document pour ce client
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-[var(--radius-lg)] border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border-primary)] bg-[var(--color-cream-50)]">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Nom
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Statut
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Taille
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Date
                      </th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {client.documents.map((doc) => (
                      <tr
                        key={doc.id}
                        className="border-b border-[var(--border-primary)] last:border-b-0"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-[var(--text-muted)]" />
                            <span className="font-medium text-[var(--text-primary)]">
                              {doc.nomFichier}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[var(--text-secondary)]">
                          {documentTypeLabel(doc.type)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={doc.statut === "VALIDE" ? "success" : doc.statut === "EXPIRE" ? "danger" : "default"} size="sm">
                            {doc.statut}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-[var(--text-muted)]">
                          {formatFileSize(doc.taille)}
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
                          {formatDate(doc.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <button className="rounded p-1 text-[var(--text-muted)] hover:bg-[var(--color-cream-100)] hover:text-[var(--text-primary)] transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── PAIEMENTS TAB ────────────────────────────────── */}
        {activeTab === "paiements" && (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="py-4">
                  <p className="text-xs text-[var(--text-muted)]">Total facture</p>
                  <p className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text-primary)]">
                    {formatDZD(totalFactures)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <p className="text-xs text-[var(--text-muted)]">Total paye</p>
                  <p className="font-[family-name:var(--font-heading)] text-lg font-bold text-green-600">
                    {formatDZD(totalPaye)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <p className="text-xs text-[var(--text-muted)]">Solde restant</p>
                  <p className={`font-[family-name:var(--font-heading)] text-lg font-bold ${soldeRestant > 0 ? "text-[var(--color-error)]" : "text-green-600"}`}>
                    {formatDZD(soldeRestant)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Factures list */}
            {client.factures.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                  Factures recentes
                </h3>
                <div className="rounded-[var(--radius-lg)] border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border-primary)] bg-[var(--color-cream-50)]">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                          Numero
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                          Statut
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                          Montant
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                          Echeance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {client.factures.map((facture) => (
                        <tr
                          key={facture.id}
                          className="border-b border-[var(--border-primary)] last:border-b-0"
                        >
                          <td className="px-4 py-3 font-mono text-xs font-medium text-[var(--color-primary-500)]">
                            {facture.numero}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={factureStatutLabel(facture.statut)}
                              size="sm"
                            >
                              {facture.statut}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                            {formatDZD(Number(facture.total))}
                          </td>
                          <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
                            {formatDate(facture.dateEcheance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payments list */}
            {client.paiements.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                  Paiements recus
                </h3>
                <div className="rounded-[var(--radius-lg)] border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border-primary)] bg-[var(--color-cream-50)]">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                          Montant
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                          Methode
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {client.paiements.map((paiement) => (
                        <tr
                          key={paiement.id}
                          className="border-b border-[var(--border-primary)] last:border-b-0"
                        >
                          <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
                            {formatDate(paiement.datePaiement)}
                          </td>
                          <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                            {formatDZD(Number(paiement.montant))}
                          </td>
                          <td className="px-4 py-3 text-[var(--text-secondary)]">
                            {paiement.methode}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={paiementStatutLabel(paiement.statut)}
                              size="sm"
                            >
                              {paiement.statut}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {client.factures.length === 0 && client.paiements.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CreditCard className="h-10 w-10 text-[var(--color-cream-400)]" />
                  <p className="mt-3 text-sm text-[var(--text-muted)]">
                    Aucune facture ni paiement pour ce client
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ── HISTORIQUE TAB ───────────────────────────────── */}
        {activeTab === "historique" && (
          <div className="space-y-4">
            {client.historiques.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <History className="h-10 w-10 text-[var(--color-cream-400)]" />
                  <p className="mt-3 text-sm text-[var(--text-muted)]">
                    Aucun historique pour ce client
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="relative space-y-0">
                {/* Timeline line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-px bg-[var(--border-primary)]" />

                {client.historiques.map((entry) => (
                  <div
                    key={entry.id}
                    className="relative flex gap-4 py-3"
                  >
                    {/* Dot */}
                    <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--border-primary)] bg-[var(--bg-card)]">
                      <History className="h-4 w-4 text-[var(--text-muted)]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant={actionBadgeColor(entry.action)} size="sm">
                          {actionLabel(entry.action)}
                        </Badge>
                        <span className="text-xs text-[var(--text-muted)]">
                          {formatDate(entry.createdAt)}
                        </span>
                      </div>
                      {entry.user && (
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          Par {entry.user.prenom} {entry.user.nom}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── NOTES TAB ────────────────────────────────────── */}
        {activeTab === "notes" && (
          <div className="space-y-6">
            {/* General notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes generales</CardTitle>
              </CardHeader>
              <CardContent>
                {client.notes ? (
                  <p className="whitespace-pre-wrap text-sm text-[var(--text-secondary)]">
                    {client.notes}
                  </p>
                ) : (
                  <p className="text-sm italic text-[var(--text-muted)]">
                    Aucune note pour ce client
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            {client.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {client.tags.map((tag) => (
                      <Badge key={tag} variant="accent" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact info */}
            <Card>
              <CardHeader>
                <CardTitle>Informations complementaires</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium text-[var(--text-muted)]">
                      Source d&apos;acquisition
                    </dt>
                    <dd className="mt-0.5 text-sm text-[var(--text-primary)]">
                      {client.sourceAcquisition
                        ? client.sourceAcquisition.replace(/_/g, " ").toLowerCase()
                        : "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-[var(--text-muted)]">
                      Nationalite
                    </dt>
                    <dd className="mt-0.5 text-sm text-[var(--text-primary)]">
                      {client.nationalite}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-[var(--text-muted)]">
                      Date de naissance
                    </dt>
                    <dd className="mt-0.5 text-sm text-[var(--text-primary)]">
                      {formatDate(client.dateNaissance) ?? "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-[var(--text-muted)]">
                      Lieu de naissance
                    </dt>
                    <dd className="mt-0.5 text-sm text-[var(--text-primary)]">
                      {client.lieuNaissance ?? "-"}
                    </dd>
                  </div>
                  {client.cniNumero && (
                    <div>
                      <dt className="text-xs font-medium text-[var(--text-muted)]">
                        CNI
                      </dt>
                      <dd className="mt-0.5 font-mono text-sm text-[var(--text-primary)]">
                        {client.cniNumero}
                      </dd>
                    </div>
                  )}
                  {client.passeportNumero && (
                    <div>
                      <dt className="text-xs font-medium text-[var(--text-muted)]">
                        Passeport
                      </dt>
                      <dd className="mt-0.5 font-mono text-sm text-[var(--text-primary)]">
                        {client.passeportNumero}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs font-medium text-[var(--text-muted)]">
                      Cree le
                    </dt>
                    <dd className="mt-0.5 text-sm text-[var(--text-primary)]">
                      {formatDate(client.createdAt) ?? "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-[var(--text-muted)]">
                      Mis a jour le
                    </dt>
                    <dd className="mt-0.5 text-sm text-[var(--text-primary)]">
                      {formatDate(client.updatedAt) ?? "-"}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Emergency contacts */}
            {client.contacts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Contacts d&apos;urgence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {client.contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border-primary)] p-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {contact.nom}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {contact.lien.replace(/_/g, " ")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[var(--text-secondary)]">
                            {contact.telephone}
                          </p>
                          {contact.email && (
                            <p className="text-xs text-[var(--text-muted)]">
                              {contact.email}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Desactiver le client"
        description="Cette action va desactiver le client. Il ne sera plus visible dans les listes actives."
      >
        <p className="text-sm text-[var(--text-secondary)]">
          Etes-vous sur de vouloir desactiver le client{" "}
          <strong>
            {client.prenom} {client.nom}
          </strong>{" "}
          ({client.numeroClient}) ?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
            Annuler
          </Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>
            Desactiver
          </Button>
        </div>
      </Modal>
    </div>
  );
}
