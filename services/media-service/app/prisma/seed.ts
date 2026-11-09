import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SAMPLE_POST_ID = '5eed0000-0000-4000-8000-000000000001';
const STUDENT_ID = '11111111-1111-4111-8111-111111111111';
const TUTOR_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

async function main(): Promise<void> {
  await prisma.publication.upsert({
    where: { id: SAMPLE_POST_ID },
    update: {},
    create: {
      id: SAMPLE_POST_ID,
      authorId: TUTOR_ID,
      authorName: 'Daniel Rojas',
      authorRole: 'tutor',
      content: 'Ofrezco clases de Python y JavaScript. Cupos disponibles esta semana.',
    },
  });

  const hasComment = await prisma.comment.count({ where: { postId: SAMPLE_POST_ID } });
  if (hasComment === 0) {
    await prisma.comment.create({
      data: {
        postId: SAMPLE_POST_ID,
        authorId: STUDENT_ID,
        authorName: 'Camila Ríos',
        content: '¿Tienes horario disponible en las tardes?',
      },
    });
  }
}

main()
  .catch((error: unknown) => {
    process.stderr.write(`Seed failed: ${String(error)}\n`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
