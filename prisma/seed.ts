import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Agence Pro...\n");

  // 1. Create demo agence
  const existingAgence = await prisma.agence.findFirst({ where: { email: "demo@agencepro.dz" } });
  const agence = existingAgence ?? await prisma.agence.create({
    data: {
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
  console.log(`✅ Agence: ${agence.nom} (${agence.id})`);

  // 2. Create admin user
  const existingUser = await prisma.user.findUnique({ where: { email: "admin@agencepro.dz" } });
  const admin = existingUser ?? await prisma.user.create({
    data: {
      email: "admin@agencepro.dz",
      nom: "Admin",
      prenom: "Demo",
      passwordHash: "$2a$10$placeholder",
      role: "ADMIN",
      agenceId: agence.id,
    },
  });
  console.log(`✅ Admin: ${admin.prenom} ${admin.nom} (${admin.id})`);

  // 3. Create user-agence assignment
  const existingAssignment = await prisma.userAgenceAssignment.findFirst({
    where: { userId: admin.id, agenceId: agence.id },
  });
  if (!existingAssignment) {
    await prisma.userAgenceAssignment.create({
      data: {
        userId: admin.id,
        agenceId: agence.id,
        role: "ADMIN",
      },
    });
    console.log(`✅ Assignment: Admin → ${agence.nom}`);
  }

  // 4. Create demo clients
  const clients = [
    { nom: "Benali", prenom: "Mohamed", telephone: "+213555100001", email: "m.benali@email.com" },
    { nom: "Khelifi", prenom: "Amina", telephone: "+213555100002", email: "a.khelifi@email.com" },
    { nom: "Meziane", prenom: "Youcef", telephone: "+213555100003", email: null as string | null },
  ];

  for (let i = 0; i < clients.length; i++) {
    const existing = await prisma.client.findFirst({
      where: { agenceId: agence.id, telephone: clients[i].telephone },
    });
    if (!existing) {
      const c = await prisma.client.create({
        data: {
          agenceId: agence.id,
          code: `C-${String(i + 1).padStart(4, "0")}`,
          nom: clients[i].nom,
          prenom: clients[i].prenom,
          telephone: clients[i].telephone,
          email: clients[i].email,
        },
      });
      console.log(`✅ Client: ${c.prenom} ${c.nom}`);
    }
  }

  // 5. Create demo programme
  const existingProg = await prisma.programme.findFirst({
    where: { agenceId: agence.id, code: "P-OMRA-2026" },
  });
  if (!existingProg) {
    const programme = await prisma.programme.create({
      data: {
        agenceId: agence.id,
        code: "P-OMRA-2026",
        titre: "Omra Ramadan 2026",
        description: "Pèlerinage Omra pendant le mois de Ramadan",
        destination: "La Mecque",
        dureeJours: 14,
        dateDebut: new Date("2026-03-01"),
        dateFin: new Date("2026-03-15"),
        prixVente: 350000,
        inclus: ["Vol aller-retour", "Hôtel 4*", "Transferts", "Assurance"],
        nonInclus: ["Visa", "Dépenses personnelles"],
        statut: "PUBLIE",
      },
    });
    console.log(`✅ Programme: ${programme.titre}`);
  }

  console.log("\n🎉 Seed terminé !");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
