/* eslint-disable @typescript-eslint/no-unused-vars */
import 'dotenv/config';  // .env se DATABASE_URL load
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { dummyproducts, dummyMenu } from './data/dummydata';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });  // ye compulsory!

async function main() {
  // Admin user
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: await bcrypt.hash('password123', 10),
    },
  });
  console.log('✅ Admin ready → admin@example.com / password123');

  // Products (DSA rule: immutable data – id omit kar)
  for (const product of dummyproducts) {
    const { id, ...data } = product;
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: data,
    });
  }
  console.log(`✅ ${dummyproducts.length} products seeded!`);

  // Menu items
  for (const item of dummyMenu) {
    const { id, ...data } = item;
    await prisma.menuItem.upsert({
      where: { name: item.name },
      update: {},
      create: data,
    });
  }
  console.log(`✅ ${dummyMenu.length} menu items seeded!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();  // pool close (clean shutdown)
  });