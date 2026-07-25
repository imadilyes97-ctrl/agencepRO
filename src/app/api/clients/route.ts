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
import { CreateClientSchema, ClientFilterSchema } from "@/schemas/client";
import { generateRef, PAGE_SIZE } from "@/lib/utils";
import type { ApiResponse } from "@/types";

// ── Helper: Extract session from cookie ───────────────────────

function getSessionUser(request: NextRequest) {
  const sessionToken = request.cookies.get("session-token")?.value;
  if (!sessionToken) {
    throw new UnauthorizedError();
  }

  // Placeholder — will be replaced by NextAuth in Phase 4
  // For now, decode a simple base64 token: agenceId:userId:role:email
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

  console.error("[API /clients] Erreur inattendue:", error);
  return NextResponse.json(
    { success: false, error: "Une erreur interne est survenue", code: "INTERNAL_ERROR" },
    { status: 500 },
  );
}

// ── GET /api/clients — List with pagination + search ──────────

export async function GET(request: NextRequest) {
  try {
    const user = getSessionUser(request);
    requirePermission(user.role, "read", "client");

    const { searchParams } = new URL(request.url);

    const filters = {
      query: searchParams.get("query") ?? undefined,
      statut: searchParams.get("statut") ?? undefined,
      sourceAcquisition: searchParams.get("sourceAcquisition") ?? undefined,
      dateFrom: searchParams.get("dateFrom") ?? undefined,
      dateTo: searchParams.get("dateTo") ?? undefined,
      wilaya: searchParams.get("wilaya") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
      orderBy: searchParams.get("orderBy") ?? undefined,
      orderDir: searchParams.get("orderDir") ?? undefined,
    };

    const f = ClientFilterSchema.parse(filters);

    const where: Record<string, unknown> = { agenceId: user.agenceId };

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
        select: {
          id: true,
          numeroClient: true,
          civilite: true,
          nom: true,
          prenom: true,
          telephonePrincipal: true,
          telephoneSecondaire: true,
          email: true,
          wilaya: true,
          commune: true,
          statut: true,
          sourceAcquisition: true,
          nombreVoyages: true,
          montantTotalDepense: true,
          dernierVoyageDate: true,
          scoreFidelite: true,
          assigneA: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.client.count({ where: where as never }),
    ]);

    const meta = {
      total,
      page: f.page,
      pageSize: f.pageSize,
      totalPages: Math.ceil(total / f.pageSize),
    };

    const response: ApiResponse<typeof clients> = {
      success: true,
      data: clients,
      meta,
    };

    return NextResponse.json(response);
  } catch (error) {
    return errorResponse(error);
  }
}

// ── POST /api/clients — Create ────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const user = getSessionUser(request);
    requirePermission(user.role, "create", "client");

    const body = await request.json();
    const data = CreateClientSchema.parse(body);

    // Generate unique code
    const count = await prisma.client.count({
      where: { agenceId: user.agenceId },
    });
    const numeroClient = generateRef("CLT", count + 1);

    // Check duplicate email
    if (data.email) {
      const existing = await prisma.client.findFirst({
        where: {
          agenceId: user.agenceId,
          email: data.email,
        },
      });
      if (existing) {
        throw new ConflictError(
          `Un client avec l'email "${data.email}" existe deja`,
        );
      }
    }

    // Check duplicate phone
    const existingPhone = await prisma.client.findFirst({
      where: {
        agenceId: user.agenceId,
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
        agenceId: user.agenceId,
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

    // Log creation
    await prisma.historiqueAction.create({
      data: {
        agenceId: user.agenceId,
        userId: user.id,
        action: "CREATION",
        entityType: "CLIENT",
        entityId: client.id,
        nouvelleValeur: { numeroClient, nom: data.nom, prenom: data.prenom },
      },
    });

    return NextResponse.json(
      { success: true, data: client } satisfies ApiResponse<typeof client>,
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
