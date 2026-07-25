"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Users, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge, statutBadgeVariant, statutLabel } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { DataTable, type Column, type PaginationMeta, type SortDirection } from "@/components/ui/DataTable";
import { showToast } from "@/components/ui/Toast";
import { formatDate, formatDZD } from "@/lib/utils";
import type { ApiResponse } from "@/types";

// ── Types ─────────────────────────────────────────────────────

interface ClientListItem {
  id: string;
  numeroClient: string;
  civilite: string | null;
  nom: string;
  prenom: string;
  telephonePrincipal: string;
  email: string | null;
  wilaya: string | null;
  commune: string | null;
  statut: string;
  sourceAcquisition: string | null;
  nombreVoyages: number;
  montantTotalDepense: number;
  dernierVoyageDate: string | null;
  scoreFidelite: number;
  assigneA: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CreateClientFormData {
  civilite: string;
  nom: string;
  prenom: string;
  telephonePrincipal: string;
  telephoneSecondaire: string;
  email: string;
  dateNaissance: string;
  wilaya: string;
  commune: string;
  adresseComplete: string;
  notes: string;
}

const INITIAL_FORM: CreateClientFormData = {
  civilite: "",
  nom: "",
  prenom: "",
  telephonePrincipal: "",
  telephoneSecondaire: "",
  email: "",
  dateNaissance: "",
  wilaya: "",
  commune: "",
  adresseComplete: "",
  notes: "",
};

const WILAYAS_ALGERIE = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Bejaia",
  "Biskra", "Bechar", "Blida", "Bouira", "Tamanrasset", "Tebessa",
  "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel",
  "Setif", "Saida", "Skikda", "Sidi Bel Abbes", "Annaba", "Guelma",
  "Constantine", "Medea", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerdes",
  "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras",
  "Tipaza", "Mila", "Ain Defla", "Naama", "Ain Temouchent", "Ghardaia",
  "Relizane", "El M'Ghair", "El Meniaa", "Ouled Djellal", "Bordj Badji Mokhtar",
  "Beni Abbes", "Timimoun", "Touggourt", "Djanet", "In Salah", "In Guezzam",
];

// ── Component ─────────────────────────────────────────────────

export default function ClientsPage() {
  const router = useRouter();

  // Data state
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    pageSize: 25,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [filterWilaya, setFilterWilaya] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Sort state
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  // Create modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateClientFormData>(INITIAL_FORM);
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);

  // ── Debounced search ──────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedQuery, filterStatut, filterWilaya]);

  // ── Fetch clients ─────────────────────────────────────────

  const fetchClients = useCallback(async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set("query", debouncedQuery);
      if (filterStatut) params.set("statut", filterStatut);
      if (filterWilaya) params.set("wilaya", filterWilaya);
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      params.set("orderBy", sortBy);
      params.set("orderDir", sortDir);

      const res = await fetch(`/api/clients?${params.toString()}`);
      const json: ApiResponse<ClientListItem[]> = await res.json();

      if (json.success && json.data) {
        setClients(json.data);
        if (json.meta) {
          setPagination(json.meta);
        }
      } else {
        showToast.error("Erreur", "success" in json && !json.success ? (json as { error: string }).error : "Impossible de charger les clients");
      }
    } catch {
      showToast.error("Erreur reseau", "Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, filterStatut, filterWilaya, sortBy, sortDir]);

  useEffect(() => {
    fetchClients(pagination.page, pagination.pageSize);
  }, [fetchClients, pagination.page, pagination.pageSize]);

  // ── Sort handler ──────────────────────────────────────────

  function handleSort(key: string) {
    if (sortBy === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  }

  // ── Create client ─────────────────────────────────────────

  function validateCreateForm(): boolean {
    const errors: Record<string, string> = {};

    if (!createForm.nom.trim() || createForm.nom.trim().length < 2) {
      errors.nom = "Le nom doit contenir au moins 2 caracteres";
    }
    if (!createForm.prenom.trim()) {
      errors.prenom = "Le prenom est obligatoire";
    }
    if (!createForm.telephonePrincipal.trim()) {
      errors.telephonePrincipal = "Le telephone est obligatoire";
    } else if (!/^\+?213[0-9]{9}$/.test(createForm.telephonePrincipal.trim())) {
      errors.telephonePrincipal = "Le telephone doit etre au format +213XXXXXXXXX";
    }
    if (createForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email)) {
      errors.email = "Adresse email invalide";
    }

    setCreateErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleCreateClient() {
    if (!validateCreateForm()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          civilite: createForm.civilite || undefined,
          nom: createForm.nom.trim(),
          prenom: createForm.prenom.trim(),
          telephonePrincipal: createForm.telephonePrincipal.trim(),
          telephoneSecondaire: createForm.telephoneSecondaire.trim() || undefined,
          email: createForm.email.trim() || undefined,
          dateNaissance: createForm.dateNaissance || undefined,
          wilaya: createForm.wilaya || undefined,
          commune: createForm.commune || undefined,
          adresseComplete: createForm.adresseComplete.trim() || undefined,
          notes: createForm.notes.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (json.success) {
        showToast.success("Client cree", `${createForm.prenom} ${createForm.nom} a ete ajoute`);
        setCreateModalOpen(false);
        setCreateForm(INITIAL_FORM);
        setCreateErrors({});
        fetchClients(1, pagination.pageSize);
      } else {
        showToast.error("Erreur", json.error || "Impossible de creer le client");
        if (json.details) {
          setCreateErrors(
            Object.fromEntries(
              Object.entries(json.details).map(([k, v]) => [k, (v as string[])[0]]),
            ),
          );
        }
      }
    } catch {
      showToast.error("Erreur reseau", "Impossible de contacter le serveur");
    } finally {
      setCreating(false);
    }
  }

  // ── Table columns ─────────────────────────────────────────

  const columns: Column<ClientListItem>[] = [
    {
      key: "numeroClient",
      label: "Code",
      sortable: true,
      className: "font-mono text-xs whitespace-nowrap",
      render: (row) => (
        <span className="font-mono text-xs text-[var(--color-primary-500)]">
          {row.numeroClient}
        </span>
      ),
    },
    {
      key: "nom",
      label: "Nom complet",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-xs font-semibold text-[var(--color-primary-500)]">
            {row.prenom.charAt(0)}
            {row.nom.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-[var(--text-primary)]">
              {row.prenom} {row.nom}
            </p>
            {row.email && (
              <p className="text-xs text-[var(--text-muted)]">{row.email}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "telephonePrincipal",
      label: "Telephone",
      sortable: false,
      className: "whitespace-nowrap",
    },
    {
      key: "wilaya",
      label: "Wilaya",
      sortable: false,
      render: (row) => (
        <span className="text-[var(--text-secondary)]">
          {row.wilaya ?? "-"}
        </span>
      ),
    },
    {
      key: "nombreVoyages",
      label: "Voyages",
      sortable: true,
      className: "text-center",
      render: (row) => (
        <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[var(--color-primary-50)] px-2 text-xs font-medium text-[var(--color-primary-500)]">
          {row.nombreVoyages}
        </span>
      ),
    },
    {
      key: "statut",
      label: "Statut",
      sortable: true,
      render: (row) => (
        <Badge variant={statutBadgeVariant(row.statut)} size="sm">
          {statutLabel(row.statut)}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Cree le",
      sortable: true,
      className: "whitespace-nowrap text-xs text-[var(--text-muted)]",
      render: (row) => formatDate(row.createdAt) ?? "-",
    },
    {
      key: "actions",
      label: "",
      className: "w-10",
      render: () => (
        <button
          onClick={(e) => e.stopPropagation()}
          className="rounded-[var(--radius-md)] p-1 text-[var(--text-muted)] hover:bg-[var(--color-cream-100)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Actions"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
          </svg>
        </button>
      ),
    },
  ];

  // ── Top bar (search + filters) ───────────────────────────

  const topBar = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un client..."
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-primary)] bg-[var(--bg-card)] pl-9 pr-3 text-sm placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-300)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          Filtres
          {(filterStatut || filterWilaya) && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary-500)] text-[10px] font-bold text-white">
              {[filterStatut, filterWilaya].filter(Boolean).length}
            </span>
          )}
        </Button>
      </div>
      <Button onClick={() => setCreateModalOpen(true)}>
        <Plus className="h-4 w-4" />
        Nouveau client
      </Button>
    </div>
  );

  // ── Filter panel ─────────────────────────────────────────

  const filterPanel = showFilters ? (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-primary)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-sm)]">
      <div className="flex flex-wrap gap-4">
        <div className="min-w-[200px] flex-1">
          <label className="mb-1 block text-xs font-medium text-[var(--text-muted)]">
            Statut
          </label>
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-primary)] bg-[var(--bg-card)] px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-300)]"
          >
            <option value="">Tous les statuts</option>
            <option value="ACTIF">Actif</option>
            <option value="INACTIF">Inactif</option>
            <option value="BLOQUE">Bloque</option>
            <option value="BLACKLISTE">Blackliste</option>
          </select>
        </div>
        <div className="min-w-[200px] flex-1">
          <label className="mb-1 block text-xs font-medium text-[var(--text-muted)]">
            Wilaya
          </label>
          <select
            value={filterWilaya}
            onChange={(e) => setFilterWilaya(e.target.value)}
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-primary)] bg-[var(--bg-card)] px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-300)]"
          >
            <option value="">Toutes les wilayas</option>
            {WILAYAS_ALGERIE.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
        {(filterStatut || filterWilaya) && (
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterStatut("");
                setFilterWilaya("");
              }}
              className="text-sm text-[var(--color-primary-500)] hover:underline"
            >
              Effacer les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  ) : null;

  // ── Create form fields ───────────────────────────────────

  function formField(
    key: keyof CreateClientFormData,
    label: string,
    placeholder: string,
    options?: { required?: boolean; type?: string; as?: "select"; items?: { value: string; label: string }[] },
  ) {
    const error = createErrors[key];
    const isRequired = options?.required;

    if (options?.as === "select" && options.items) {
      return (
        <div key={key} className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--text-primary)]">
            {label}
            {isRequired && <span className="text-[var(--color-error)]"> *</span>}
          </label>
          <select
            value={createForm[key]}
            onChange={(e) =>
              setCreateForm((prev) => ({ ...prev, [key]: e.target.value }))
            }
            className={`h-10 w-full rounded-[var(--radius-md)] border bg-[var(--bg-card)] px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-300)] ${
              error
                ? "border-[var(--color-error)]"
                : "border-[var(--border-primary)]"
            }`}
          >
            <option value="">{placeholder}</option>
            {options.items.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
        </div>
      );
    }

    return (
      <div key={key} className="space-y-1.5">
        <label className="block text-sm font-medium text-[var(--text-primary)]">
          {label}
          {isRequired && <span className="text-[var(--color-error)]"> *</span>}
        </label>
        <input
          type={options?.type ?? "text"}
          value={createForm[key]}
          onChange={(e) =>
            setCreateForm((prev) => ({ ...prev, [key]: e.target.value }))
          }
          placeholder={placeholder}
          className={`h-10 w-full rounded-[var(--radius-md)] border bg-[var(--bg-card)] px-3 text-sm placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-300)] ${
            error
              ? "border-[var(--color-error)]"
              : "border-[var(--border-primary)]"
          }`}
        />
        {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
          Clients
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Gerez votre base de clients et leur historique
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-primary-50)]">
              <Users className="h-5 w-5 text-[var(--color-primary-500)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Total clients</p>
              <p className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text-primary)]">
                {pagination.total}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data table */}
      <DataTable
        columns={columns}
        data={clients}
        pagination={pagination}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={handleSort}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        onPageSizeChange={(pageSize) =>
          setPagination((prev) => ({ ...prev, pageSize, page: 1 }))
        }
        onRowClick={(row) => router.push(`/clients/${row.id}`)}
        emptyMessage="Aucun client trouve. Cliquez sur 'Nouveau client' pour en ajouter un."
        loading={loading}
        rowKey={(row) => row.id}
        topBar={
          <>
            {topBar}
            {filterPanel}
          </>
        }
      />

      {/* Create client modal */}
      <Modal
        open={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setCreateErrors({});
        }}
        title="Nouveau client"
        description="Ajoutez un nouveau client a votre base de donnees"
        maxWidth="lg"
      >
        <div className="max-h-[60vh] overflow-y-auto -mx-6 px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {formField("civilite", "Civilite", "", {
              as: "select",
              items: [
                { value: "MONSIEUR", label: "Monsieur" },
                { value: "MADAME", label: "Madame" },
                { value: "MADEMOISELLE", label: "Mademoiselle" },
              ],
            })}
            <div />
            {formField("nom", "Nom", "Dupont", { required: true })}
            {formField("prenom", "Prenom", "Jean", { required: true })}
            {formField(
              "telephonePrincipal",
              "Telephone principal",
              "+213555123456",
              { required: true },
            )}
            {formField("telephoneSecondaire", "Telephone secondaire", "+213...")}
            {formField("email", "Email", "jean@exemple.com", { type: "email" })}
            {formField(
              "dateNaissance",
              "Date de naissance",
              "",
              { type: "date" },
            )}
            {formField(
              "wilaya",
              "Wilaya",
              "Selectionnez...",
              {
                as: "select",
                items: WILAYAS_ALGERIE.map((w) => ({ value: w, label: w })),
              },
            )}
            {formField("commune", "Commune", "Alger")}
            {formField("adresseComplete", "Adresse", "123 rue...", { required: false })}
            <div className="sm:col-span-2">
              {formField("notes", "Notes", "Informations complementaires...")}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-[var(--border-primary)] pt-4">
          <Button
            variant="ghost"
            onClick={() => {
              setCreateModalOpen(false);
              setCreateErrors({});
            }}
          >
            Annuler
          </Button>
          <Button loading={creating} onClick={handleCreateClient}>
            Creer le client
          </Button>
        </div>
      </Modal>
    </div>
  );
}
