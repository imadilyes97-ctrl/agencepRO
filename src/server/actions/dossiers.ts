"use server";

import { prisma } from "@/lib/db";
import { NotFoundError, ValidationError, ConflictError } from "@/lib/errors";
import {
  CreateDossierSchema,
  UpdateDossierSchema,
  UpdateDossierStatutSchema,
  DossierFilterSchema,
  STATUT_TRANSITIONS,
  type CreateDossierInput,
  type UpdateDossierInput,
  type UpdateDossierStatutInput,
  type DossierFilters,
} from "@/schemas/dossier";
import { generateRef, PAGE_SIZE } from "@/lib/constants";
import { z } from "zod";
import type { DossierStatut } from "@prisma/client";

// ── Helpers ────────────────────────────────────────────────────

/**
 * Get the next sequence number for dossier references.
 * Uses the current year + sequential counter.
 */
async function getNextDossierSequence(): Promise<number> {
  const year = new Date().getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);

  const count = await prisma.dossier.count({
    where: {
      createdAt: {
        gte: startOfYear,
        lt: endOfYear,
      },
    },
  });

  return count + 1;
}

/**
 * Get the current user's agenceId from session context.
 * This is a placeholder — integrate with your auth system.
 */
async function getCurrentAgenceId(): Promise<string> {
  // TODO: Replace with actual session/auth check
  // e.g., const session = await auth();
  // return session.user.agenceId;
  const placeholder = await prisma.agence.findFirst({
    select: { id: true },
  });
  if (!placeholder) {
    throw new NotFoundError("Agence");
  }
  return placeholder.id;
}

/**
 * Get the current user's ID from session context.
 */
async function getCurrentUserId(): Promise<string | null> {
  // TODO: Replace with actual session/auth check
  return null;
}

// ── Server Actions ─────────────────────────────────────────────

/**
 * Create a new dossier with auto-generated reference.
 * Reference format: D-YYYY-NNNNNN
 */
export async function createDossier(input: CreateDossierInput) {
  const parsed = CreateDossierSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path.join(".");
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(issue.message);
    });
    throw new ValidationError(fieldErrors);
  }

  const data = parsed.data;
  const agenceId = await getCurrentAgenceId();
  const sequence = await getNextDossierSequence();
  const reference = generateRef("D", sequence);

  // Compute montant restant
  const montantRestant = data.montantTotal;

  const dossier = await prisma.dossier.create({
    data: {
      agenceId,
      clientId: data.clientId,
      typeDossier: data.typeDossier,
      reference,
      statut: "PROSPECT",
      dateDepart: data.dateDepart,
      dateRetour: data.dateRetour ?? null,
      montantTotal: data.montantTotal,
      montantPaye: 0,
      montantRestant,
      devise: data.devise,
      notes: data.notes,
      groupeId: data.groupeId ?? null,
      programmeId: data.programmeId ?? null,
      forfaitId: data.forfaitId ?? null,
      tags: data.tags,
    },
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
  });

  // Log creation in HistoriqueAction
  const userId = await getCurrentUserId();
  await prisma.historiqueAction.create({
    data: {
      agenceId,
      userId,
      action: "CREATION",
      entityType: "DOSSIER",
      entityId: dossier.id,
      nouvelleValeur: {
        reference: dossier.reference,
        client: `${dossier.client.prenom} ${dossier.client.nom}`,
        destination: data.destination,
        typeDossier: data.typeDossier,
        statut: "PROSPECT",
      },
    },
  });

  return dossier;
}

/**
 * Update a dossier's fields (non-status changes).
 */
export async function updateDossier(id: string, input: UpdateDossierInput) {
  const parsed = UpdateDossierSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path.join(".");
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(issue.message);
    });
    throw new ValidationError(fieldErrors);
  }

  const existing = await prisma.dossier.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundError("Dossier", id);
  }

  const data = parsed.data;

  // Compute montant restant if montantTotal or montantPaye changed
  const newMontantTotal = data.montantTotal ?? existing.montantTotal;
  const newMontantPaye = data.montantPaye ?? existing.montantPaye;
  const montantRestant = Number(newMontantTotal) - Number(newMontantPaye);

  const dossier = await prisma.dossier.update({
    where: { id },
    data: {
      intitule: data.intitule,
      destination: data.destination,
      dateDepart: data.dateDepart,
      dateRetour: data.dateRetour,
      nbAdultes: data.nbAdultes,
      nbEnfants: data.nbEnfants,
      nbBebes: data.nbBebes,
      montantTotal: data.montantTotal,
      montantPaye: data.montantPaye,
      montantRestant,
      devise: data.devise,
      groupeId: data.groupeId,
      programmeId: data.programmeId,
      forfaitId: data.forfaitId,
      notes: data.notes,
      tags: data.tags,
    },
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
  });

  // Log modification
  const userId = await getCurrentUserId();
  await prisma.historiqueAction.create({
    data: {
      agenceId: existing.agenceId,
      userId,
      action: "MODIFICATION",
      entityType: "DOSSIER",
      entityId: id,
      ancienneValeur: {
        intitule: existing.notes,
        montantTotal: existing.montantTotal.toString(),
      },
      nouvelleValeur: {
        intitule: dossier.notes,
        montantTotal: dossier.montantTotal.toString(),
      },
    },
  });

  return dossier;
}

/**
 * Change dossier status with transition validation and history logging.
 */
export async function updateDossierStatut(
  id: string,
  input: UpdateDossierStatutInput,
) {
  const parsed = UpdateDossierStatutSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path.join(".");
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(issue.message);
    });
    throw new ValidationError(fieldErrors);
  }

  const { statut: newStatut, notes } = parsed.data;

  const existing = await prisma.dossier.findUnique({
    where: { id },
    include: {
      client: {
        select: { nom: true, prenom: true },
      },
    },
  });
  if (!existing) {
    throw new NotFoundError("Dossier", id);
  }

  // Validate transition
  const allowedTransitions = STATUT_TRANSITIONS[existing.statut];
  if (!allowedTransitions.includes(newStatut)) {
    throw new ConflictError(
      `Transition invalide : ${existing.statut} → ${newStatut}. Transitions autorisées : ${allowedTransitions.join(", ")}`,
    );
  }

  const oldStatut = existing.statut;

  const [dossier] = await prisma.$transaction([
    prisma.dossier.update({
      where: { id },
      data: {
        statut: newStatut,
        notes: notes ?? existing.notes,
      },
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
    }),
    prisma.historiqueAction.create({
      data: {
        agenceId: existing.agenceId,
        userId: await getCurrentUserId(),
        action: "CHANGEMENT_STATUT",
        entityType: "DOSSIER",
        entityId: id,
        ancienneValeur: { statut: oldStatut },
        nouvelleValeur: { statut: newStatut, notes },
        details: {
          reference: existing.reference,
          client: `${existing.client.prenom} ${existing.client.nom}`,
          from: oldStatut,
          to: newStatut,
          motif: notes,
        },
      },
    }),
  ]);

  return dossier;
}

/**
 * Get a single dossier with all related data.
 */
export async function getDossier(id: string) {
  const dossier = await prisma.dossier.findUnique({
    where: { id },
    include: {
      client: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          telephonePrincipal: true,
          telephoneSecondaire: true,
          email: true,
          civilite: true,
          nationalite: true,
          passeportNumero: true,
          passeportDateExpiration: true,
          cniNumero: true,
          cniDateExpiration: true,
        },
      },
      groupe: {
        select: {
          id: true,
          nom: true,
          statut: true,
          dateDepart: true,
          dateRetour: true,
          capaciteMax: true,
        },
      },
      programme: {
        select: {
          id: true,
          nom: true,
          description: true,
          dateDepart: true,
          dateRetour: true,
          hotelNom: true,
          hotelEtoiles: true,
          nbNuits: true,
          prixParPersonne: true,
          visitesIncluses: true,
        },
      },
      forfait: {
        select: {
          id: true,
          nom: true,
          description: true,
          composants: true,
          prixTotal: true,
          devise: true,
        },
      },
      vol: {
        select: {
          id: true,
          compagnie: true,
          numeroVol: true,
          depart: true,
          arrivee: true,
          dateDepart: true,
          dateArrivee: true,
          classe: true,
          statut: true,
        },
      },
      hotel: {
        select: {
          id: true,
          nom: true,
          ville: true,
          pays: true,
          etoiles: true,
        },
      },
      paiements: {
        select: {
          id: true,
          montant: true,
          devise: true,
          methode: true,
          statut: true,
          datePaiement: true,
          reference: true,
        },
        orderBy: { createdAt: "desc" },
      },
      documents: {
        select: {
          id: true,
          type: true,
          nomFichier: true,
          statut: true,
          dateExpiration: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      visa: {
        select: {
          id: true,
          typeVisa: true,
          paysDestination: true,
          statut: true,
          dateDepot: true,
          dateRetour: true,
          numeroVisa: true,
          fraisTotal: true,
        },
      },
      historiques: {
        where: { entityType: "DOSSIER" },
        select: {
          id: true,
          action: true,
          ancienneValeur: true,
          nouvelleValeur: true,
          details: true,
          createdAt: true,
          user: {
            select: { nom: true, prenom: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!dossier) {
    throw new NotFoundError("Dossier", id);
  }

  return dossier;
}

/**
 * Get paginated list of dossiers with filters.
 */
export async function getDossiers(filters: DossierFilters) {
  const parsed = DossierFilterSchema.safeParse(filters);
  const f = parsed.success ? parsed.data : { page: 1, pageSize: PAGE_SIZE };

  const where: Record<string, unknown> = {};

  if (f.statut) {
    where.statut = f.statut;
  }

  if (f.typeDossier) {
    where.typeDossier = f.typeDossier;
  }

  if (f.clientId) {
    where.clientId = f.clientId;
  }

  if (f.dateFrom || f.dateTo) {
    where.dateDepart = {};
    if (f.dateFrom) {
      (where.dateDepart as Record<string, Date>).gte = f.dateFrom;
    }
    if (f.dateTo) {
      (where.dateDepart as Record<string, Date>).lte = f.dateTo;
    }
  }

  if (f.query) {
    where.OR = [
      { reference: { contains: f.query, mode: "insensitive" } },
      { client: { nom: { contains: f.query, mode: "insensitive" } } },
      { client: { prenom: { contains: f.query, mode: "insensitive" } } },
      { destination: { contains: f.query, mode: "insensitive" } },
      { intitule: { contains: f.query, mode: "insensitive" } },
    ];
  }

  const skip = (f.page - 1) * f.pageSize;

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
      take: f.pageSize,
    }),
    prisma.dossier.count({ where }),
  ]);

  const totalPages = Math.ceil(total / f.pageSize);

  return {
    dossiers,
    meta: {
      total,
      page: f.page,
      pageSize: f.pageSize,
      totalPages,
    },
  };
}

/**
 * Delete a dossier (only if PROSPECT or ANNULE).
 */
export async function deleteDossier(id: string) {
  const existing = await prisma.dossier.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundError("Dossier", id);
  }

  // Only allow deletion of PROSPECT or ANNULE dossiers
  if (existing.statut !== "PROSPECT" && existing.statut !== "ANNULE") {
    throw new ConflictError(
      "Seuls les dossiers en statut Prospect ou Annulé peuvent être supprimés",
    );
  }

  const userId = await getCurrentUserId();

  await prisma.$transaction([
    prisma.historiqueAction.create({
      data: {
        agenceId: existing.agenceId,
        userId,
        action: "SUPPRESSION",
        entityType: "DOSSIER",
        entityId: id,
        ancienneValeur: {
          reference: existing.reference,
          statut: existing.statut,
        },
      },
    }),
    prisma.dossier.delete({ where: { id } }),
  ]);

  return { success: true };
}

/**
 * Get valid transitions for a dossier's current status.
 */
export async function getValidTransitions(id: string) {
  const dossier = await prisma.dossier.findUnique({
    where: { id },
    select: { statut: true },
  });

  if (!dossier) {
    throw new NotFoundError("Dossier", id);
  }

  return {
    current: dossier.statut,
    transitions: STATUT_TRANSITIONS[dossier.statut as DossierStatut],
  };
}
