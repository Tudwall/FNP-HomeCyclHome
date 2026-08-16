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

  console.log(user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
