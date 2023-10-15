// This is a seed file.
// This file will contain the dummy data and queries needed to seed your database.

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  // The upsert function will only create a new article if no article matches the where function.
  const post1 = await prisma.article.upsert({
    where: {
      title: 'Prisma Adds Support for MongoDB',
    },
    update: {},
    create: {
      title: 'Prisma Adds Support for MongoDB',
      body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      published: false,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {},
    create: {
      title: "What's new in Prisma? (Q1/22)",
      body: 'Our engineers have been working hard, issuing new releases with many improvements...',
      description:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      published: true,
    },
  });

  console.log({ post1, post2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
