import { PrismaClient } from '@prisma/client';

declare namespace NodeJS {
  interface Global {
    fetch: jest.Mock; // Déclaration existante
    prisma?: PrismaClient; // Ajoutez cette ligne pour typer global.prisma
  }
}

declare global {
  var prisma: PrismaClient | undefined; // Typage pour global.prisma
}

  