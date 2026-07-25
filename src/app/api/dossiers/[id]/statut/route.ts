import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { UpdateDossierStatutSchema, STATUT_TRANSITIONS } from "@/schemas/dossier";
import type { DossierStatut } from "@prisma/client";

// ── PUT /api/dossiers/[id]/statut — Change status ──────────────

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const parsed = UpdateDossierStatutSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      });
      return NextResponse.json(
        {
          success: false,
          error: "Donnees invalides",
          code: "VALIDATION_ERROR",
          details: fieldErrors,
        },
        { status: 400 },
      );
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
      return NextResponse.json(
        { success: false, error: "Dossier introuvable", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    // Validate transition
    const allowedTransitions = STATUT_TRANSITIONS[existing.statut];
    if (!allowedTransitions.includes(newStatut)) {
      return NextResponse.json(
        {
          success: false,
          error: `Transition invalide : ${existing.statut} -> ${newStatut}. Transitions autorisees : ${allowedTransitions.join(", ")}`,
          code: "INVALID_TRANSITION",
        },
        { status: 409 },
      );
    }

    const oldStatut = existing.statut;

    // Transaction: update status + log in historique
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

    return NextResponse.json({
      success: true,
      data: dossier,
      meta: {
        previousStatut: oldStatut,
        newStatut,
        validTransitions: STATUT_TRANSITIONS[newStatut as DossierStatut],
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode },
      );
    }
    console.error("[PUT /api/dossiers/[id]/statut]", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
