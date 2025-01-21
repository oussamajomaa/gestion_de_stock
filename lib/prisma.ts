import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(); // Une seule instance en production
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient(); // Évite plusieurs instances en dev
  }
  prisma = global.prisma;
}

export default prisma;
