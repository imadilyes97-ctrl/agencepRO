import { prisma } from "@/lib/db";

// ============================================================
// Dashboard Queries — Server-side data fetching
// ============================================================

/**
 * Compute dashboard KPIs for an agence.
 * - CA du mois: sum of confirmed paiements this month
 * - Dossiers actifs: count of dossiers not in terminal states
 * - Clients actifs: count of clients with status ACTIF
 * - Impayés: sum of (total - montantPaye) across dossiers with remaining balance
 * Plus trend data by comparing with previous month.
 */
export async function getDashboardStats(agenceId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const terminalDossierStatuses = [
    "TERMINE",
    "ANNULE",
    "REFUSE",
    "RESOLU",
  ] as const;

  const [
    currentMonthRevenue,
    previousMonthRevenue,
    activeDossiers,
    previousMonthActiveDossiers,
    activeClients,
    previousMonthActiveClients,
    unpaidResult,
    previousMonthUnpaidResult,
  ] = await Promise.all([
    // CA du mois courant — sum of CONFIRMÉ/VALIDÉ paiements this month
    prisma.paiement.aggregate({
      where: {
        agenceId,
        statut: { in: ["CONFIRME"] },
        datePaiement: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { montant: true },
    }),

    // CA du mois précédent
    prisma.paiement.aggregate({
      where: {
        agenceId,
        statut: { in: ["CONFIRME"] },
        datePaiement: { gte: startOfPrevMonth, lte: endOfPrevMonth },
      },
      _sum: { montant: true },
    }),

    // Dossiers actifs (non terminaux)
    prisma.dossier.count({
      where: {
        agenceId,
        statut: { notIn: [...terminalDossierStatuses] },
      },
    }),

    // Dossiers actifs mois précédent (basé sur createdAt)
    prisma.dossier.count({
      where: {
        agenceId,
        statut: { notIn: [...terminalDossierStatuses] },
        createdAt: { lt: startOfMonth },
      },
    }),

    // Clients actifs
    prisma.client.count({
      where: {
        agenceId,
        statut: "ACTIF",
      },
    }),

    // Clients actifs mois précédent (estimation: tous ceux créés avant ce mois)
    prisma.client.count({
      where: {
        agenceId,
        statut: "ACTIF",
        createdAt: { lt: startOfMonth },
      },
    }),

    // Impayés — dossiers avec montant restant > 0
    prisma.dossier.aggregate({
      where: {
        agenceId,
        montantRestant: { gt: 0 },
        statut: { notIn: ["ANNULE", "TERMINE", "REFUSE", "RESOLU"] },
      },
      _sum: { montantRestant: true },
    }),

    // Impayés mois précédent (basé sur dossiers créés avant ce mois)
    prisma.dossier.aggregate({
      where: {
        agenceId,
        montantRestant: { gt: 0 },
        statut: { notIn: ["ANNULE", "TERMINE", "REFUSE", "RESOLU"] },
        createdAt: { lt: startOfMonth },
      },
      _sum: { montantRestant: true },
    }),
  ]);

  const caActuel = Number(currentMonthRevenue._sum.montant ?? 0);
  const caPrecedent = Number(previousMonthRevenue._sum.montant ?? 0);
  const dossiersActifs = activeDossiers;
  const dossiersPrecedents = previousMonthActiveDossiers;
  const clientsActifs = activeClients;
  const clientsPrecedents = previousMonthActiveClients;
  const impayes = Number(unpaidResult._sum.montantRestant ?? 0);
  const impayesPrecedents = Number(previousMonthUnpaidResult._sum.montantRestant ?? 0);

  function computeTrend(current: number, previous: number) {
    if (previous === 0) {
      return { trend: "up" as const, changePercent: current > 0 ? 100 : 0 };
    }
    const change = ((current - previous) / previous) * 100;
    return {
      trend: change >= 0 ? ("up" as const) : ("down" as const),
      changePercent: Math.abs(Math.round(change)),
    };
  }

  return {
    caDuMois: {
      value: caActuel,
      ...computeTrend(caActuel, caPrecedent),
    },
    dossiersActifs: {
      value: dossiersActifs,
      ...computeTrend(dossiersActifs, dossiersPrecedents),
    },
    clientsActifs: {
      value: clientsActifs,
      ...computeTrend(clientsActifs, clientsPrecedents),
    },
    impayes: {
      value: impayes,
      ...computeTrend(impayes, impayesPrecedents),
      // For impayés, down is good (fewer unpaid)
      trend: impayes <= impayesPrecedents ? ("down" as const) : ("up" as const),
    },
  };
}

/**
 * Get the 5 most recent dossiers with client name.
 */
export async function getRecentDossiers(agenceId: string) {
  const dossiers = await prisma.dossier.findMany({
    where: { agenceId },
    include: {
      client: {
        select: { nom: true, prenom: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return dossiers.map((d) => ({
    id: d.id,
    clientName: `${d.client.prenom} ${d.client.nom}`,
    typeDossier: d.typeDossier,
    statut: d.statut,
    montantTotal: Number(d.montantTotal),
    dateDepart: d.dateDepart.toISOString(),
    createdAt: d.createdAt.toISOString(),
  }));
}

/**
 * Get the 5 most recent HistoriqueAction entries with user name.
 */
export async function getRecentActivity(agenceId: string) {
  const actions = await prisma.historiqueAction.findMany({
    where: { agenceId },
    include: {
      user: {
        select: { nom: true, prenom: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return actions.map((a) => ({
    id: a.id,
    action: a.action,
    entityType: a.entityType,
    entityId: a.entityId,
    userName: a.user ? `${a.user.prenom} ${a.user.nom}` : "Système",
    succes: a.succes,
    createdAt: a.createdAt.toISOString(),
  }));
}
