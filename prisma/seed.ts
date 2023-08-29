import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
const prisma = new PrismaClient();
async function main() {
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash('Test123.', salt);

  const aliceId: string = uuid();
  const robertId = uuid();

  await prisma.user.upsert({
    where: { username: 'Alice' },
    update: {},
    create: {
      id: aliceId,
      username: 'Alice',
      password,
    },
  });

  await prisma.user.upsert({
    where: { username: 'Robert' },
    update: {},
    create: {
      id: robertId,
      username: 'Robert',
      password,
    },
  });

  const aliceTaskId = uuid();

  await prisma.task.upsert({
    where: { id: aliceTaskId },
    update: {},
    create: {
      id: aliceTaskId,
      title: 'Alice Task',
      description: 'Alice Task Description',
      picture_url: 'https://picsum.photos/200',
      userId: aliceId,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
