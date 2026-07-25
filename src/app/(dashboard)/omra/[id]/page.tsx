import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DossierDetailClient } from "./DossierDetailClient";
import type { Metadata } from "next";

interface DossierDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: DossierDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const dossier = await prisma.dossier.findUnique({
    where: { id },
    select: { reference: true, intitule: true, destination: true },
  });

  if (!dossier) {
    return { title: "Dossier introuvable — Agence Pro" };
  }

  return {
    title: `${dossier.reference} — ${dossier.intitule ?? dossier.destination} — Agence Pro`,
  };
}

export default async function DossierDetailPage({ params }: DossierDetailPageProps) {
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
    notFound();
  }

  // Serialize for client component
  const serialized = {
    ...dossier,
    montantTotal: Number(dossier.montantTotal),
    montantPaye: Number(dossier.montantPaye),
    montantRestant: Number(dossier.montantRestant),
    dateDepart: dossier.dateDepart.toISOString(),
    dateRetour: dossier.dateRetour?.toISOString() ?? null,
    createdAt: dossier.createdAt.toISOString(),
    updatedAt: dossier.updatedAt.toISOString(),
    client: {
      ...dossier.client,
      passeportDateExpiration: dossier.client.passeportDateExpiration?.toISOString() ?? null,
      cniDateExpiration: dossier.client.cniDateExpiration?.toISOString() ?? null,
    },
    groupe: dossier.groupe
      ? {
          ...dossier.groupe,
          dateDepart: dossier.groupe.dateDepart.toISOString(),
          dateRetour: dossier.groupe.dateRetour?.toISOString() ?? null,
        }
      : null,
    programme: dossier.programme
      ? {
          ...dossier.programme,
          dateDepart: dossier.programme.dateDepart.toISOString(),
          dateRetour: dossier.programme.dateRetour.toISOString(),
          prixParPersonne: Number(dossier.programme.prixParPersonne),
        }
      : null,
    forfait: dossier.forfait
      ? {
          ...dossier.forfait,
          prixTotal: Number(dossier.forfait.prixTotal),
        }
      : null,
    vol: dossier.vol
      ? {
          ...dossier.vol,
          dateDepart: dossier.vol.dateDepart.toISOString(),
          dateArrivee: dossier.vol.dateArrivee.toISOString(),
        }
      : null,
    paiements: dossier.paiements.map((p) => ({
      ...p,
      montant: Number(p.montant),
      datePaiement: p.datePaiement.toISOString(),
    })),
    documents: dossier.documents.map((d) => ({
      ...d,
      dateExpiration: d.dateExpiration?.toISOString() ?? null,
      createdAt: d.createdAt.toISOString(),
    })),
    visa: dossier.visa
      ? {
          ...dossier.visa,
          dateDepot: dossier.visa.dateDepot?.toISOString() ?? null,
          dateRetour: dossier.visa.dateRetour?.toISOString() ?? null,
          fraisTotal: Number(dossier.visa.fraisTotal),
        }
      : null,
    historiques: dossier.historiques.map((h) => ({
      ...h,
      createdAt: h.createdAt.toISOString(),
    })),
  };

  return <DossierDetailClient dossier={serialized} />;
}
