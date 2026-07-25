import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Agence Pro...\n");

  // 1. Create demo agence
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
  console.log(`✅ Agence: ${agence.nom} (${agence.id})`);

  // 2. Create admin user (agenceId required by schema)
  const admin = await prisma.user.upsert({
    where: { email: "admin@agencepro.dz" },
    update: {},
    create: {
      email: "admin@agencepro.dz",
      nom: "Admin",
      prenom: "Demo",
      passwordHash: "$2a$10$placeholder", // bcrypt hash of "demo1234"
      role: "ADMIN",
      agenceId: agence.id,
    },
  });
  console.log(`✅ Admin: ${admin.prenom} ${admin.nom} (${admin.id})`);

  // 3. Create role definition (agenceId + role is unique)
  const adminRole = await prisma.roleDefinition.upsert({
    where: { agenceId_role: { agenceId: agence.id, role: "ADMIN" } },
    update: {},
    create: {
      agenceId: agence.id,
      role: "ADMIN",
      label: "Administrateur",
      permissions: JSON.stringify({ all: true }),
    },
  });
  console.log(`✅ Role: ${adminRole.libelle}`);

  // 4. Create user-agence assignment
  await prisma.userAgenceAssignment.upsert({
    where: { userId_agenceId: { userId: admin.id, agenceId: agence.id } },
    update: {},
    create: {
      userId: admin.id,
      agenceId: agence.id,
      roleId: adminRole.id,
    },
  });
  console.log(`✅ Assignment: Admin → ${agence.nom}`);

  // 5. Create demo clients
  const clients = [
    { nom: "Benali", prenom: "Mohamed", telephone: "+213555100001", email: "m.benali@email.com" },
    { nom: "Khelifi", prenom: "Amina", telephone: "+213555100002", email: "a.khelifi@email.com" },
    { nom: "Meziane", prenom: "Youcef", telephone: "+213555100003", email: null },
  ];

  for (let i = 0; i < clients.length; i++) {
    const c = await prisma.client.upsert({
      where: { agenceId_code: { agenceId: agence.id, code: `C-${i + 1}` } },
      update: {},
      create: {
        agenceId: agence.id,
        code: `C-${i + 1}`,
        nom: clients[i].nom,
        prenom: clients[i].prenom,
        telephone: clients[i].telephone,
        email: clients[i].email,
      },
    });
    console.log(`✅ Client: ${c.prenom} ${c.nom}`);
  }

  // 6. Create demo programme
  const programme = await prisma.programme.upsert({
    where: { agenceId_code: { agenceId: agence.id, code: "P-OMRA-2026" } },
    update: {},
    create: {
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
