import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const SALT_ROUNDS = 10;
  const pwdHash = await bcrypt.hash('alice64', SALT_ROUNDS);

  const user = await prisma.appUser.upsert({
    where: { email: 'alice@test.com' },
    update: {
      password: pwdHash,
      firstName: 'Alice',
      lastName: 'Test',
    },
    create: {
      email: 'alice@test.com',
      password: pwdHash,
      firstName: 'Alice',
      lastName: 'Test',
    },
  });

  const BIKE_TYPES = ['VTT', 'Route', 'Ville', 'VTC', 'Gravel', 'Electrique'];

  const BIKE_CATALOG: Record<string, string[]> = {
    Trek: ['Marlin 5', 'Domane AL 2', 'FX 2'],
    Specialized: ['Rockhopper', 'Allez', 'Sirrus'],
    Giant: ['Talon 3', 'Contend 2', 'Escape 3'],
  };

  for (const name of BIKE_TYPES) {
    await prisma.bikeType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const [brandName, modelNames] of Object.entries(BIKE_CATALOG)) {
    const brand = await prisma.bikeBrand.upsert({
      where: { name: brandName },
      update: {},
      create: { name: brandName },
    });

    for (const modelName of modelNames) {
      await prisma.bikeModel.upsert({
        where: { brandId_name: { brandId: brand.id, name: modelName } },
        update: {},
        create: { name: modelName, brandId: brand.id },
      });
    }
  }

  console.log(user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
