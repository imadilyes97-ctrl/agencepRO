import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import {
  NotFoundError,
  AppError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/errors";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "@/lib/constants";
import type { ApiResponse } from "@/types";

// ── Helper: Extract session from cookie ───────────────────────

function getSessionUser(request: NextRequest) {
  const sessionToken = request.cookies.get("session-token")?.value;
  if (!sessionToken) {
    throw new UnauthorizedError();
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(sessionToken, "base64").toString("utf-8"),
    );
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

  console.error("[API /clients/[id]/documents] Erreur inattendue:", error);
  return NextResponse.json(
    {
      success: false,
      error: "Une erreur interne est survenue",
      code: "INTERNAL_ERROR",
    },
    { status: 500 },
  );
}

// ── GET /api/clients/[id]/documents — List documents ──────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = getSessionUser(request);
    requirePermission(user.role, "read", "document");

    const { id: clientId } = await params;
    const { searchParams } = new URL(request.url);

    // Verify client exists
    const client = await prisma.client.findFirst({
      where: { id: clientId, agenceId: user.agenceId },
      select: { id: true, nom: true, prenom: true },
    });
    if (!client) {
      throw new NotFoundError("Client", clientId);
    }

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") ?? "25", 10)),
    );
    const type = searchParams.get("type") ?? undefined;
    const statut = searchParams.get("statut") ?? undefined;

    const where: Record<string, unknown> = {
      clientId,
      agenceId: user.agenceId,
    };

    if (type) {
      where.type = type;
    }

    if (statut) {
      where.statut = statut;
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where: where as never,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          type: true,
          categorie: true,
          nomFichier: true,
          urlFichier: true,
          taille: true,
          mimeType: true,
          statut: true,
          description: true,
          dateEmission: true,
          dateExpiration: true,
          ocrConfiance: true,
          estSigne: true,
          version: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.document.count({ where: where as never }),
    ]);

    const meta = {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    const response: ApiResponse<typeof documents> = {
      success: true,
      data: documents,
      meta,
    };

    return NextResponse.json(response);
  } catch (error) {
    return errorResponse(error);
  }
}

// ── POST /api/clients/[id]/documents — Upload placeholder ─────

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = getSessionUser(request);
    requirePermission(user.role, "create", "document");

    const { id: clientId } = await params;

    // Verify client exists
    const client = await prisma.client.findFirst({
      where: { id: clientId, agenceId: user.agenceId },
      select: { id: true, nom: true, prenom: true },
    });
    if (!client) {
      throw new NotFoundError("Client", clientId);
    }

    // Parse form data for file upload
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;
    const categorie = formData.get("categorie") as string | null;
    const description = formData.get("description") as string | null;
    const dateEmission = formData.get("dateEmission") as string | null;
    const dateExpiration = formData.get("dateExpiration") as string | null;

    if (!file) {
      throw new ValidationError({ file: ["Le fichier est obligatoire"] });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new ValidationError({
        file: [
          `Le fichier depasse la taille maximale de ${Math.round(MAX_FILE_SIZE / 1024 / 1024)} Mo`,
        ],
      });
    }

    // Validate file type
    if (
      !ALLOWED_FILE_TYPES.includes(
        file.type as (typeof ALLOWED_FILE_TYPES)[number],
      )
    ) {
      throw new ValidationError({
        file: [
          "Format de fichier non supporte. Formats autorises: PDF, JPEG, PNG, WebP",
        ],
      });
    }

    // Validate document type
    const validTypes = [
      "PASSEPORT",
      "CNI",
      "VISA",
      "PHOTO_IDENTITE",
      "CERTIFICAT_VACCINATION",
      "ATTESTATION_EMPLOI",
      "RELEVE_BANCAIRE",
      "ASSURANCE_VOYAGE",
      "CONTRAT",
      "FACTURE",
      "BILLET_AVION",
      "RESERVATION_HOTEL",
      "AUTRE",
    ];
    if (type && !validTypes.includes(type)) {
      throw new ValidationError({
        type: ["Type de document invalide"],
      });
    }

    // Placeholder: In production, upload to S3/R2/Supabase Storage
    // For now, store metadata only with a placeholder URL
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const fileUrl = `/uploads/clients/${clientId}/${fileName}`;

    const document = await prisma.document.create({
      data: {
        agenceId: user.agenceId,
        clientId,
        type: (type as never) ?? "AUTRE",
        categorie: categorie || null,
        nomFichier: file.name,
        urlFichier: fileUrl,
        taille: file.size,
        mimeType: file.type,
        description: description || null,
        dateEmission: dateEmission ? new Date(dateEmission) : null,
        dateExpiration: dateExpiration ? new Date(dateExpiration) : null,
      },
    });

    // Log creation
    await prisma.historiqueAction.create({
      data: {
        agenceId: user.agenceId,
        userId: user.id,
        action: "CREATION",
        entityType: "DOCUMENT",
        entityId: document.id,
        nouvelleValeur: {
          nomFichier: file.name,
          type: type ?? "AUTRE",
          clientId,
        },
      },
    });

    return NextResponse.json(
      { success: true, data: document } satisfies ApiResponse<typeof document>,
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
