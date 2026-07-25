/**
 * Seed script — run manually with: npx prisma db seed
 * Only creates the minimum demo data needed for first login.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Agence Pro...\n");

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

  const existing = await prisma.userAgenceAssignment.findFirst({
    where: { userId: admin.id, agenceId: agence.id },
  });
  if (!existing) {
    await prisma.userAgenceAssignment.create({
      data: { userId: admin.id, agenceId: agence.id, role: "ADMIN" },
    });
  }
  console.log(`✅ Assignment OK`);

  console.log("\n🎉 Seed terminé !");
}

main()
  .catch((e) => { console.error("❌ Seed error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
