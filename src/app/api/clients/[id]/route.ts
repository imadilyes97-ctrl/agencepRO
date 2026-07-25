import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
  AppError,
  UnauthorizedError,
} from "@/lib/errors";
import { UpdateClientSchema } from "@/schemas/client";
import type { ApiResponse } from "@/types";

// ── Helper: Extract session from cookie ───────────────────────

function getSessionUser(request: NextRequest) {
  const sessionToken = request.cookies.get("session-token")?.value;
  if (!sessionToken) {
    throw new UnauthorizedError();
  }

  try {
    const decoded = JSON.parse(Buffer.from(sessionToken, "base64").toString("utf-8"));
    return {
      id: decoded.userId as string,
      email: decoded.email as string,
      nom: decoded.nom as string,
      prenom: decoded.prenom as string,
      role: decoded.role as string,
      agenceId: decoded.agenceId as string,
    };
  } catch {
    throw new UnauthorizedError("Session invalide");
  }
}

// ── Error response helper ─────────────────────────────────────

function errorResponse(error: unknown): NextResponse {
  if (error instanceof AppError) {
    const body: ApiResponse<never> = {
      success: false,
      error: error.message,
      code: error.code,
    };
    if (error instanceof ValidationError) {
      body.details = error.details;
    }
    return NextResponse.json(body, { status: error.statusCode });
  }

  console.error("[API /clients/[id]] Erreur inattendue:", error);
  return NextResponse.json(
    { success: false, error: "Une erreur interne est survenue", code: "INTERNAL_ERROR" },
    { status: 500 },
  );
}

// ── GET /api/clients/[id] — Single client with relations ──────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = getSessionUser(request);
    requirePermission(user.role, "read", "client");

    const { id } = await params;

    const client = await prisma.client.findFirst({
      where: { id, agenceId: user.agenceId },
      include: {
        dossiers: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            typeDossier: true,
            statut: true,
            dateDepart: true,
            dateRetour: true,
            montantTotal: true,
            montantPaye: true,
            devise: true,
            createdAt: true,
          },
        },
        documents: {
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            id: true,
            type: true,
            nomFichier: true,
            statut: true,
            taille: true,
            mimeType: true,
            dateExpiration: true,
            createdAt: true,
          },
        },
        factures: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            numero: true,
            statut: true,
            total: true,
            devise: true,
            dateEmission: true,
            dateEcheance: true,
          },
        },
        paiements: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            montant: true,
            devise: true,
            methode: true,
            statut: true,
            datePaiement: true,
          },
        },
        historiques: {
          orderBy: { createdAt: "desc" },
          take: 30,
          select: {
            id: true,
            action: true,
            entityType: true,
            ancienneValeur: true,
            nouvelleValeur: true,
            details: true,
            succes: true,
            createdAt: true,
            user: {
              select: { nom: true, prenom: true },
            },
          },
        },
        contacts: true,
      },
    });

    if (!client) {
      throw new NotFoundError("Client", id);
    }

    return NextResponse.json({
      success: true,
      data: client,
    } satisfies ApiResponse<typeof client>);
  } catch (error) {
    return errorResponse(error);
  }
}

// ── PUT /api/clients/[id] — Update ────────────────────────────

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = getSessionUser(request);
    requirePermission(user.role, "update", "client");

    const { id } = await params;
    const body = await request.json();
    const data = UpdateClientSchema.parse(body);

    // Fetch existing
    const existing = await prisma.client.findFirst({
      where: { id, agenceId: user.agenceId },
    });
    if (!existing) {
      throw new NotFoundError("Client", id);
    }

    // Check email uniqueness
    if (data.email && data.email !== existing.email) {
      const duplicate = await prisma.client.findFirst({
        where: {
          agenceId: user.agenceId,
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

    // Check phone uniqueness
    if (
      data.telephonePrincipal &&
      data.telephonePrincipal !== existing.telephonePrincipal
    ) {
      const duplicate = await prisma.client.findFirst({
        where: {
          agenceId: user.agenceId,
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

    // Build immutable update payload
    const updateData: Record<string, unknown> = {};
    const fieldMap: Array<[keyof typeof data, string]> = [
      ["civilite", "civilite"],
      ["nom", "nom"],
      ["prenom", "prenom"],
      ["telephonePrincipal", "telephonePrincipal"],
      ["telephoneSecondaire", "telephoneSecondaire"],
      ["email", "email"],
      ["dateNaissance", "dateNaissance"],
      ["lieuNaissance", "lieuNaissance"],
      ["sexe", "sexe"],
      ["nationalite", "nationalite"],
      ["adresseComplete", "adresseComplete"],
      ["wilaya", "wilaya"],
      ["commune", "commune"],
      ["codePostal", "codePostal"],
      ["sourceAcquisition", "sourceAcquisition"],
      ["notes", "notes"],
      ["tags", "tags"],
      ["segments", "segments"],
      ["assigneA", "assigneA"],
      ["statut", "statut"],
      ["cniNumero", "cniNumero"],
      ["cniDateEmission", "cniDateEmission"],
      ["cniDateExpiration", "cniDateExpiration"],
      ["cniLieuEmission", "cniLieuEmission"],
      ["passeportNumero", "passeportNumero"],
      ["passeportDateEmission", "passeportDateEmission"],
      ["passeportDateExpiration", "passeportDateExpiration"],
      ["passeportLieuEmission", "passeportLieuEmission"],
      ["passeportNationalite", "passeportNationalite"],
      ["contactUrgenceNom", "contactUrgenceNom"],
      ["contactUrgenceLien", "contactUrgenceLien"],
      ["contactUrgenceTelephone", "contactUrgenceTelephone"],
      ["contactUrgenceEmail", "contactUrgenceEmail"],
      ["prefAlimentaires", "prefAlimentaires"],
      ["prefChambre", "prefChambre"],
      ["prefNiveauConfort", "prefNiveauConfort"],
      ["prefBudgetMin", "prefBudgetMin"],
      ["prefBudgetMax", "prefBudgetMax"],
      ["prefLangue", "prefLangue"],
      ["notesPreferences", "notesPreferences"],
    ];

    for (const [inputKey, dbKey] of fieldMap) {
      const val = data[inputKey];
      if (val !== undefined) {
        // Date fields need conversion
        if (
          [
            "dateNaissance",
            "cniDateEmission",
            "cniDateExpiration",
            "passeportDateEmission",
            "passeportDateExpiration",
          ].includes(dbKey)
        ) {
          updateData[dbKey] = val ? new Date(val as string | Date) : null;
        } else if (
          [
            "telephoneSecondaire",
            "email",
            "lieuNaissance",
            "adresseComplete",
            "wilaya",
            "commune",
            "codePostal",
            "notes",
            "assigneA",
            "cniNumero",
            "cniLieuEmission",
            "passeportNumero",
            "passeportLieuEmission",
            "passeportNationalite",
            "contactUrgenceNom",
            "contactUrgenceTelephone",
            "contactUrgenceEmail",
            "notesPreferences",
          ].includes(dbKey)
        ) {
          updateData[dbKey] = val || null;
        } else if (
          ["civilite", "sexe", "sourceAcquisition", "contactUrgenceLien", "prefChambre", "prefNiveauConfort"].includes(dbKey)
        ) {
          updateData[dbKey] = val ?? null;
        } else if (["prefBudgetMin", "prefBudgetMax"].includes(dbKey)) {
          updateData[dbKey] = val ?? null;
        } else {
          updateData[dbKey] = val;
        }
      }
    }

    const client = await prisma.client.update({
      where: { id },
      data: updateData,
    });

    // Log history
    await prisma.historiqueAction.create({
      data: {
        agenceId: user.agenceId,
        userId: user.id,
        action: "MODIFICATION",
        entityType: "CLIENT",
        entityId: client.id,
        ancienneValeur: {
          nom: existing.nom,
          prenom: existing.prenom,
          email: existing.email,
          telephone: existing.telephonePrincipal,
          statut: existing.statut,
        },
        nouvelleValeur: updateData,
      },
    });

    return NextResponse.json({
      success: true,
      data: client,
    } satisfies ApiResponse<typeof client>);
  } catch (error) {
    return errorResponse(error);
  }
}

// ── DELETE /api/clients/[id] — Soft delete ────────────────────

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = getSessionUser(request);
    requirePermission(user.role, "delete", "client");

    const { id } = await params;

    const existing = await prisma.client.findFirst({
      where: { id, agenceId: user.agenceId },
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
        agenceId: user.agenceId,
        userId: user.id,
        action: "DESACTIVATION",
        entityType: "CLIENT",
        entityId: client.id,
        ancienneValeur: { statut: existing.statut },
        nouvelleValeur: { statut: "INACTIF" },
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: client.id },
    } satisfies ApiResponse<{ id: string }>);
  } catch (error) {
    return errorResponse(error);
  }
}
