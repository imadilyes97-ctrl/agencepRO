import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { DossierFilterSchema, CreateDossierSchema } from "@/schemas/dossier";
import { generateRef } from "@/lib/utils";
import { PAGE_SIZE } from "@/lib/constants";

// ── GET /api/dossiers — List dossiers with filters ─────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = DossierFilterSchema.safeParse({
      statut: searchParams.get("statut") ?? undefined,
      typeDossier: searchParams.get("typeDossier") ?? undefined,
      clientId: searchParams.get("clientId") ?? undefined,
      dateFrom: searchParams.get("dateFrom") ?? undefined,
      dateTo: searchParams.get("dateTo") ?? undefined,
      query: searchParams.get("query") ?? undefined,
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? PAGE_SIZE,
    });

    const f = filters.success ? filters.data : { page: 1, pageSize: PAGE_SIZE };

    // Build WHERE clause
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

    return NextResponse.json({
      success: true,
      data: dossiers,
      meta: {
        total,
        page: f.page,
        pageSize: f.pageSize,
        totalPages,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode },
      );
    }
    console.error("[GET /api/dossiers]", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

// ── POST /api/dossiers — Create a new dossier ──────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = CreateDossierSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      });
      return NextResponse.json(
        { success: false, error: "Données invalides", code: "VALIDATION_ERROR", details: fieldErrors },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Get agenceId from session (placeholder)
    const agence = await prisma.agence.findFirst({ select: { id: true } });
    if (!agence) {
      return NextResponse.json(
        { success: false, error: "Agence introuvable", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    // Generate reference
    const year = new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    const count = await prisma.dossier.count({
      where: { createdAt: { gte: startOfYear, lt: endOfYear } },
    });
    const reference = generateRef("D", count + 1);

    const montantRestant = data.montantTotal;

    const dossier = await prisma.dossier.create({
      data: {
        agenceId: agence.id,
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

    // Log creation
    await prisma.historiqueAction.create({
      data: {
        agenceId: agence.id,
        action: "CREATION",
        entityType: "DOSSIER",
        entityId: dossier.id,
        nouvelleValeur: {
          reference: dossier.reference,
          typeDossier: data.typeDossier,
          statut: "PROSPECT",
          destination: data.destination,
        },
      },
    });

    return NextResponse.json({ success: true, data: dossier }, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode },
      );
    }
    console.error("[POST /api/dossiers]", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
