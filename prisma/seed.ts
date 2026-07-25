import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Agence Pro...\n");

  // 1. Agence
  const agence = await prisma.agence.upsert({
    where: { email: "demo@agencepro.dz" },
    update: {},
    create: {
      nom: "Agence Pro Demo",
      nomCommercial: "Agence Pro",
      adresseSiege: "123 Rue Didouche Mourad, Alger Centre",
      wilaya: "16",
      commune: "Alger Centre",
      rcNumber: "16/00-12345",
      nifNumber: "160000000000001",
      telephoneFixe: "021 63 00 00",
      telephoneMobile: "0555 63 00 00",
      email: "demo@agencepro.dz",
      statut: "ACTIVE",
    },
  });
  console.log(`✅ Agence: ${agence.nom}`);

  // 2. Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@agencepro.dz" },
    update: {},
    create: {
      email: "admin@agencepro.dz",
      nom: "Admin",
      prenom: "Demo",
      passwordHash: "$2a$10$placeholder",
      role: "ADMIN",
      agenceId: agence.id,
    },
  });
  console.log(`✅ Admin: ${admin.prenom} ${admin.nom}`);

  // 3. Assignment
  const existing = await prisma.userAgenceAssignment.findFirst({
    where: { userId: admin.id, agenceId: agence.id },
  });
  if (!existing) {
    await prisma.userAgenceAssignment.create({
      data: { userId: admin.id, agenceId: agence.id, role: "ADMIN" },
    });
    console.log(`✅ Assignment: Admin → ${agence.nom}`);
  }

  // 4. Clients
  const clients = [
    { nom: "Benali", prenom: "Mohamed", telephonePrincipal: "+213555100001", email: "m.benali@email.com" },
    { nom: "Khelifi", prenom: "Amina", telephonePrincipal: "+213555100002", email: "a.khelifi@email.com" },
    { nom: "Meziane", prenom: "Youcef", telephonePrincipal: "+213555100003", email: null as string | null },
  ];

  for (let i = 0; i < clients.length; i++) {
    const existing = await prisma.client.findFirst({
      where: { agenceId: agence.id, nom: clients[i].nom, prenom: clients[i].prenom },
    });
    if (!existing) {
      await prisma.client.create({
        data: {
          agenceId: agence.id,
          numeroClient: `CLT-${String(i + 1).padStart(4, "0")}`,
          ...clients[i],
        },
      });
      console.log(`✅ Client: ${clients[i].prenom} ${clients[i].nom}`);
    }
  }

  // 5. Programme
  const existingProg = await prisma.programme.findFirst({
    where: { agenceId: agence.id },
  });
  if (!existingProg) {
    await prisma.programme.create({
      data: {
        agenceId: agence.id,
        nom: "Omra Ramadan 2026",
        description: "Pèlerinage Omra pendant le mois de Ramadan",
        dateDepart: new Date("2026-03-01"),
        dateRetour: new Date("2026-03-15"),
        villeDepart: "Alger",
        villeArrivee: "La Mecque",
        nbNuits: 13,
        guideInclus: true,
        mealsInclus: "Pension complète",
        prixParPersonne: 350000,
        devise: "DZD",
        capaciteMax: 40,
        placesRestantes: 40,
        statut: "ACTIF",
      },
    });
    console.log(`✅ Programme: Omra Ramadan 2026`);
  }

  console.log("\n🎉 Seed terminé !");
}

main()
  .catch((e) => { console.error("❌ Seed error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
