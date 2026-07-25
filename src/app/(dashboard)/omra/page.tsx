import { prisma } from "@/lib/db";
import { PAGE_SIZE } from "@/lib/constants";
import { DossierListClient } from "./DossierListClient";
import type { DossierStatut, TypeDossier } from "@prisma/client";

export const metadata = {
  title: "Omra / Hajj — Agence Pro",
  description: "Gestion des dossiers Omra, Hajj et Tourisme",
};

interface OmraPageProps {
  searchParams: Promise<{
    statut?: string;
    typeDossier?: string;
    query?: string;
    page?: string;
  }>;
}

export default async function OmraPage({ searchParams }: OmraPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  // Build WHERE clause
  const where: Record<string, unknown> = {};

  if (params.statut) {
    where.statut = params.statut as DossierStatut;
  }
  if (params.typeDossier) {
    where.typeDossier = params.typeDossier as TypeDossier;
  }
  if (params.query) {
    where.OR = [
      { reference: { contains: params.query, mode: "insensitive" } },
      { client: { nom: { contains: params.query, mode: "insensitive" } } },
      { client: { prenom: { contains: params.query, mode: "insensitive" } } },
      { destination: { contains: params.query, mode: "insensitive" } },
      { intitule: { contains: params.query, mode: "insensitive" } },
    ];
  }

  const [dossiers, total] = await Promise.all([
    prisma.dossier.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            telephonePrincipal: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.dossier.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Serialize dates for client component
  const serializedDossiers = dossiers.map((d) => ({
    ...d,
    montantTotal: Number(d.montantTotal),
    montantPaye: Number(d.montantPaye),
    montantRestant: Number(d.montantRestant),
    dateDepart: d.dateDepart.toISOString(),
    dateRetour: d.dateRetour?.toISOString() ?? null,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
    client: {
      ...d.client,
    },
  }));

  return (
    <DossierListClient
      initialDossiers={serializedDossiers}
      meta={{
        total,
        page,
        pageSize: PAGE_SIZE,
        totalPages,
      }}
      initialFilters={{
        statut: params.statut,
        typeDossier: params.typeDossier,
        query: params.query,
      }}
    />
  );
}
