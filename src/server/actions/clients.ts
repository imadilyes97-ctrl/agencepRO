"use server";

import { prisma } from "@/lib/db";
import { generateRef, PAGE_SIZE } from "@/lib/constants";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
  AppError,
} from "@/lib/errors";
import {
  CreateClientSchema,
  UpdateClientSchema,
  ClientFilterSchema,
  type CreateClientInput,
  type UpdateClientInput,
  type ClientFilterInput,
} from "@/schemas/client";
import type { ApiResponse, PaginationMeta } from "@/types";

// ── Helpers ───────────────────────────────────────────────────

function validateInput<T>(schema: { parse: (v: unknown) => T }, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err && typeof err === "object" && "issues" in err) {
      const issues = (err as { issues: Array<{ path: (string | number)[]; message: string }> }).issues;
      const details: Record<string, string[]> = {};
      for (const issue of issues) {
        const key = issue.path.join(".");
        if (!details[key]) details[key] = [];
        details[key].push(issue.message);
      }
      throw new ValidationError(details);
    }
    throw err;
  }
}

function handleError(error: unknown): ApiResponse<never> {
  if (error instanceof AppError) {
    const response: ApiResponse<never> = {
      success: false,
      error: error.message,
      code: error.code,
    };
    if (error instanceof ValidationError) {
      response.details = error.details;
    }
    return response;
  }
  console.error("[Client Actions] Erreur inattendue:", error);
  return {
    success: false,
    error: "Une erreur interne est survenue",
    code: "INTERNAL_ERROR",
  };
}

function getNextClientSequence(agenceId: string): Promise<number> {
  return prisma.client
    .count({ where: { agenceId } })
    .then((count) => count + 1);
}

// ── Create Client ─────────────────────────────────────────────

export async function createClient(
  input: CreateClientInput,
  agenceId: string,
  userId?: string,
): Promise<ApiResponse<Record<string, unknown>>> {
  try {
    const data = validateInput(CreateClientSchema, input);

    // Generate unique client code
    const sequence = await getNextClientSequence(agenceId);
    const numeroClient = generateRef("CLT", sequence);

    // Check for duplicate email
    if (data.email) {
      const existing = await prisma.client.findFirst({
        where: {
          agenceId,
          email: data.email,
        },
      });
      if (existing) {
        throw new ConflictError(
          `Un client avec l'email "${data.email}" existe deja`,
        );
      }
    }

    // Check for duplicate phone
    const existingPhone = await prisma.client.findFirst({
      where: {
        agenceId,
        telephonePrincipal: data.telephonePrincipal,
      },
    });
    if (existingPhone) {
      throw new ConflictError(
        `Un client avec le telephone "${data.telephonePrincipal}" existe deja`,
      );
    }

    const client = await prisma.client.create({
      data: {
        agenceId,
        numeroClient,
        civilite: data.civilite ?? null,
        nom: data.nom,
        prenom: data.prenom,
        telephonePrincipal: data.telephonePrincipal,
        telephoneSecondaire: data.telephoneSecondaire || null,
        email: data.email || null,
        dateNaissance: data.dateNaissance
          ? new Date(data.dateNaissance as string | Date)
          : null,
        lieuNaissance: data.lieuNaissance || null,
        sexe: data.sexe ?? null,
        nationalite: data.nationalite,
        adresseComplete: data.adresseComplete || null,
        wilaya: data.wilaya || null,
        commune: data.commune || null,
        codePostal: data.codePostal || null,
        sourceAcquisition: data.sourceAcquisition ?? null,
        notes: data.notes || null,
        tags: data.tags ?? [],
        segments: data.segments ?? [],
        assigneA: data.assigneA || null,
        cniNumero: data.cniNumero || null,
        cniDateEmission: data.cniDateEmission
          ? new Date(data.cniDateEmission as string | Date)
          : null,
        cniDateExpiration: data.cniDateExpiration
          ? new Date(data.cniDateExpiration as string | Date)
          : null,
        cniLieuEmission: data.cniLieuEmission || null,
        passeportNumero: data.passeportNumero || null,
        passeportDateEmission: data.passeportDateEmission
          ? new Date(data.passeportDateEmission as string | Date)
          : null,
        passeportDateExpiration: data.passeportDateExpiration
          ? new Date(data.passeportDateExpiration as string | Date)
          : null,
        passeportLieuEmission: data.passeportLieuEmission || null,
        passeportNationalite: data.passeportNationalite || null,
        contactUrgenceNom: data.contactUrgenceNom || null,
        contactUrgenceLien: data.contactUrgenceLien ?? null,
        contactUrgenceTelephone: data.contactUrgenceTelephone || null,
        contactUrgenceEmail: data.contactUrgenceEmail || null,
        prefAlimentaires: data.prefAlimentaires ?? [],
        prefChambre: data.prefChambre ?? null,
        prefNiveauConfort: data.prefNiveauConfort ?? null,
        prefBudgetMin: data.prefBudgetMin ?? null,
        prefBudgetMax: data.prefBudgetMax ?? null,
        prefLangue: data.prefLangue ?? [],
        notesPreferences: data.notesPreferences || null,
      },
    });

    // Log history
    await prisma.historiqueAction.create({
      data: {
        agenceId,
        userId: userId ?? null,
        action: "CREATION",
        entityType: "CLIENT",
        entityId: client.id,
        nouvelleValeur: { numeroClient, nom: data.nom, prenom: data.prenom },
      },
    });

    return { success: true, data: client as unknown as Record<string, unknown> };
  } catch (error) {
    return handleError(error);
  }
}

// ── Update Client ─────────────────────────────────────────────

export async function updateClient(
  id: string,
  input: UpdateClientInput,
  agenceId: string,
  userId?: string,
): Promise<ApiResponse<Record<string, unknown>>> {
  try {
    const data = validateInput(UpdateClientSchema, input);

    // Fetch existing client
    const existing = await prisma.client.findFirst({
      where: { id, agenceId },
    });
    if (!existing) {
      throw new NotFoundError("Client", id);
    }

    // Check email uniqueness if changing
    if (data.email && data.email !== existing.email) {
      const duplicate = await prisma.client.findFirst({
        where: {
          agenceId,
          email: data.email,
          id: { not: id },
        },
      });
      if (duplicate) {
        throw new ConflictError(
          `Un autre client utilise deja l'email "${data.email}"`,
        );
      }
    }

    // Check phone uniqueness if changing
    if (data.telephonePrincipal && data.telephonePrincipal !== existing.telephonePrincipal) {
      const duplicate = await prisma.client.findFirst({
        where: {
          agenceId,
          telephonePrincipal: data.telephonePrincipal,
          id: { not: id },
        },
      });
      if (duplicate) {
        throw new ConflictError(
          `Un autre client utilise deja le telephone "${data.telephonePrincipal}"`,
        );
      }
    }

    // Build immutable update data
    const updateData: Record<string, unknown> = {};
    if (data.civilite !== undefined) updateData.civilite = data.civilite ?? null;
    if (data.nom !== undefined) updateData.nom = data.nom;
    if (data.prenom !== undefined) updateData.prenom = data.prenom;
    if (data.telephonePrincipal !== undefined) updateData.telephonePrincipal = data.telephonePrincipal;
    if (data.telephoneSecondaire !== undefined) updateData.telephoneSecondaire = data.telephoneSecondaire || null;
    if (data.email !== undefined) updateData.email = data.email || null;
    if (data.dateNaissance !== undefined) updateData.dateNaissance = data.dateNaissance ? new Date(data.dateNaissance as string | Date) : null;
    if (data.lieuNaissance !== undefined) updateData.lieuNaissance = data.lieuNaissance || null;
    if (data.sexe !== undefined) updateData.sexe = data.sexe ?? null;
    if (data.nationalite !== undefined) updateData.nationalite = data.nationalite;
    if (data.adresseComplete !== undefined) updateData.adresseComplete = data.adresseComplete || null;
    if (data.wilaya !== undefined) updateData.wilaya = data.wilaya || null;
    if (data.commune !== undefined) updateData.commune = data.commune || null;
    if (data.codePostal !== undefined) updateData.codePostal = data.codePostal || null;
    if (data.sourceAcquisition !== undefined) updateData.sourceAcquisition = data.sourceAcquisition ?? null;
    if (data.notes !== undefined) updateData.notes = data.notes || null;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.segments !== undefined) updateData.segments = data.segments;
    if (data.assigneA !== undefined) updateData.assigneA = data.assigneA || null;
    if (data.statut !== undefined) updateData.statut = data.statut;
    if (data.cniNumero !== undefined) updateData.cniNumero = data.cniNumero || null;
    if (data.cniDateEmission !== undefined) updateData.cniDateEmission = data.cniDateEmission ? new Date(data.cniDateEmission as string | Date) : null;
    if (data.cniDateExpiration !== undefined) updateData.cniDateExpiration = data.cniDateExpiration ? new Date(data.cniDateExpiration as string | Date) : null;
    if (data.cniLieuEmission !== undefined) updateData.cniLieuEmission = data.cniLieuEmission || null;
    if (data.passeportNumero !== undefined) updateData.passeportNumero = data.passeportNumero || null;
    if (data.passeportDateEmission !== undefined) updateData.passeportDateEmission = data.passeportDateEmission ? new Date(data.passeportDateEmission as string | Date) : null;
    if (data.passeportDateExpiration !== undefined) updateData.passeportDateExpiration = data.passeportDateExpiration ? new Date(data.passeportDateExpiration as string | Date) : null;
    if (data.passeportLieuEmission !== undefined) updateData.passeportLieuEmission = data.passeportLieuEmission || null;
    if (data.passeportNationalite !== undefined) updateData.passeportNationalite = data.passeportNationalite || null;
    if (data.contactUrgenceNom !== undefined) updateData.contactUrgenceNom = data.contactUrgenceNom || null;
    if (data.contactUrgenceLien !== undefined) updateData.contactUrgenceLien = data.contactUrgenceLien ?? null;
    if (data.contactUrgenceTelephone !== undefined) updateData.contactUrgenceTelephone = data.contactUrgenceTelephone || null;
    if (data.contactUrgenceEmail !== undefined) updateData.contactUrgenceEmail = data.contactUrgenceEmail || null;
    if (data.prefAlimentaires !== undefined) updateData.prefAlimentaires = data.prefAlimentaires;
    if (data.prefChambre !== undefined) updateData.prefChambre = data.prefChambre ?? null;
    if (data.prefNiveauConfort !== undefined) updateData.prefNiveauConfort = data.prefNiveauConfort ?? null;
    if (data.prefBudgetMin !== undefined) updateData.prefBudgetMin = data.prefBudgetMin ?? null;
    if (data.prefBudgetMax !== undefined) updateData.prefBudgetMax = data.prefBudgetMax ?? null;
    if (data.prefLangue !== undefined) updateData.prefLangue = data.prefLangue;
    if (data.notesPreferences !== undefined) updateData.notesPreferences = data.notesPreferences || null;

    const client = await prisma.client.update({
      where: { id },
      data: updateData,
    });

    // Log history with diff
    await prisma.historiqueAction.create({
      data: {
        agenceId,
        userId: userId ?? null,
        action: "MODIFICATION",
        entityType: "CLIENT",
        entityId: client.id,
        ancienneValeur: {
          nom: existing.nom,
          prenom: existing.prenom,
          email: existing.email,
          telephone: existing.telephonePrincipal,
        },
        nouvelleValeur: updateData,
      },
    });

    return { success: true, data: client as unknown as Record<string, unknown> };
  } catch (error) {
    return handleError(error);
  }
}

// ── Soft Delete Client ────────────────────────────────────────

export async function deleteClient(
  id: string,
  agenceId: string,
  userId?: string,
): Promise<ApiResponse<{ id: string }>> {
  try {
    const existing = await prisma.client.findFirst({
      where: { id, agenceId },
    });
    if (!existing) {
      throw new NotFoundError("Client", id);
    }

    const client = await prisma.client.update({
      where: { id },
      data: { statut: "INACTIF" },
    });

    // Log history
    await prisma.historiqueAction.create({
      data: {
        agenceId,
        userId: userId ?? null,
        action: "DESACTIVATION",
        entityType: "CLIENT",
        entityId: client.id,
        ancienneValeur: { statut: existing.statut },
        nouvelleValeur: { statut: "INACTIF" },
      },
    });

    return { success: true, data: { id: client.id } };
  } catch (error) {
    return handleError(error);
  }
}

// ── Get Clients (list with filters + pagination) ──────────────

export async function getClients(
  filters: ClientFilterInput,
  agenceId: string,
): Promise<
  ApiResponse<Record<string, unknown>[]>>
> {
  try {
    const f = validateInput(ClientFilterSchema, filters);

    // Build where clause
    const where: Record<string, unknown> = { agenceId };

    if (f.statut) {
      where.statut = f.statut;
    }

    if (f.sourceAcquisition) {
      where.sourceAcquisition = f.sourceAcquisition;
    }

    if (f.wilaya) {
      where.wilaya = f.wilaya;
    }

    if (f.dateFrom || f.dateTo) {
      where.createdAt = {};
      const dateRange = where.createdAt as Record<string, Date>;
      if (f.dateFrom) dateRange.gte = new Date(f.dateFrom as string | Date);
      if (f.dateTo) dateRange.lte = new Date(f.dateTo as string | Date);
    }

    // Full-text search on nom, prenom, email, telephone, numeroClient
    if (f.query) {
      where.OR = [
        { nom: { contains: f.query, mode: "insensitive" } },
        { prenom: { contains: f.query, mode: "insensitive" } },
        { email: { contains: f.query, mode: "insensitive" } },
        { telephonePrincipal: { contains: f.query } },
        { numeroClient: { contains: f.query, mode: "insensitive" } },
      ];
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where: where as never,
        orderBy: { [f.orderBy]: f.orderDir },
        skip: (f.page - 1) * f.pageSize,
        take: f.pageSize,
      }),
      prisma.client.count({ where: where as never }),
    ]);

    const meta: PaginationMeta = {
      total,
      page: f.page,
      pageSize: f.pageSize,
      totalPages: Math.ceil(total / f.pageSize),
    };

    return {
      success: true,
      data: clients as unknown as Record<string, unknown>[],
      meta,
    };
  } catch (error) {
    return handleError(error);
  }
}

// ── Get Single Client ─────────────────────────────────────────

export async function getClientById(
  id: string,
  agenceId: string,
): Promise<ApiResponse<Record<string, unknown>>> {
  try {
    const client = await prisma.client.findFirst({
      where: { id, agenceId },
      include: {
        dossiers: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        documents: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        factures: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        historiques: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { user: { select: { nom: true, prenom: true } } },
        },
        contacts: true,
        paiements: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!client) {
      throw new NotFoundError("Client", id);
    }

    return { success: true, data: client as unknown as Record<string, unknown> };
  } catch (error) {
    return handleError(error);
  }
}

// ── Get Client Documents ──────────────────────────────────────

export async function getClientDocuments(
  clientId: string,
  agenceId: string,
  page = 1,
  pageSize = 25,
): Promise<ApiResponse<Record<string, unknown>[]>> {
  try {
    // Verify client exists
    const client = await prisma.client.findFirst({
      where: { id: clientId, agenceId },
    });
    if (!client) {
      throw new NotFoundError("Client", clientId);
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where: { clientId, agenceId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.document.count({ where: { clientId, agenceId } }),
    ]);

    const meta: PaginationMeta = {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    return {
      success: true,
      data: documents as unknown as Record<string, unknown>[],
      meta,
    };
  } catch (error) {
    return handleError(error);
  }
}
