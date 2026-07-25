import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AppError, NotFoundError, ConflictError } from "@/lib/errors";
import { UpdateDossierSchema } from "@/schemas/dossier";

// ── GET /api/dossiers/[id] — Single dossier with relations ────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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
      return NextResponse.json(
        { success: false, error: "Dossier introuvable", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: dossier });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode },
      );
    }
    console.error("[GET /api/dossiers/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

// ── PUT /api/dossiers/[id] — Update dossier ────────────────────

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const parsed = UpdateDossierSchema.safeParse(body);
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

    const existing = await prisma.dossier.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Dossier introuvable", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const data = parsed.data;

    // Compute montant restant
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
    await prisma.historiqueAction.create({
      data: {
        agenceId: existing.agenceId,
        action: "MODIFICATION",
        entityType: "DOSSIER",
        entityId: id,
        ancienneValeur: { montantTotal: existing.montantTotal.toString() },
        nouvelleValeur: { montantTotal: dossier.montantTotal.toString() },
      },
    });

    return NextResponse.json({ success: true, data: dossier });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode },
      );
    }
    console.error("[PUT /api/dossiers/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

// ── DELETE /api/dossiers/[id] — Delete dossier ─────────────────

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existing = await prisma.dossier.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Dossier introuvable", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    // Only allow deletion of PROSPECT or ANNULE dossiers
    if (existing.statut !== "PROSPECT" && existing.statut !== "ANNULE") {
      return NextResponse.json(
        {
          success: false,
          error: "Seuls les dossiers en statut Prospect ou Annule peuvent etre supprimes",
          code: "CONFLICT",
        },
        { status: 409 },
      );
    }

    await prisma.$transaction([
      prisma.historiqueAction.create({
        data: {
          agenceId: existing.agenceId,
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

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode },
      );
    }
    console.error("[DELETE /api/dossiers/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
