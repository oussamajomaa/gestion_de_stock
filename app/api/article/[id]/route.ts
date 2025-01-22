// Importation des modules nécessaires de Next.js et Prisma
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Fonction GET pour récupérer un article spécifique
export async function GET(request: NextRequest, { params }: any) {
  const { id } = await params;

  try {
    // Validation de l'ID (doit être un entier valide)
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Récupération de l'article avec ses lots associés
    const article = await prisma.article.findUnique({
      where: { id: numericId },
      include: { batches: true },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Retourne l'article trouvé en réponse JSON
    return NextResponse.json(article);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Fonction PUT pour mettre à jour un article spécifique
export async function PUT(request: NextRequest, { params }: any) {
  const { id } = await params;

  // Validation de l'ID
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    // Récupération des données du corps de la requête
    const body = await request.json();
    const { article_name, article_description, barcode, quantity_min, unit, unit_price, categoryId } = body || {};

    // Préparation des données mises à jour
    const updatedData = {
      article_name,
      article_description,
      barcode,
      quantity_min: parseFloat(quantity_min),
      unit,
      unit_price: parseFloat(unit_price),
      category: categoryId ? { connect: { id: parseInt(categoryId, 10) } } : undefined,
    };

    // Mise à jour de l'article dans la base de données
    await prisma.article.update({
      where: { id: numericId },
      data: updatedData,
    });

    return NextResponse.json({ message: "Un article a été mis à jour" });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Fonction DELETE pour supprimer un article et ses données associées
export async function DELETE(request: NextRequest, { params }: any) {
  const { id } = await params;

  // Validation de l'ID
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    // Récupérer tous les lots associés à l'article
    const batches = await prisma.batch.findMany({
      where: { articleId: numericId },
    });

    // Extraire les IDs des lots
    const batchIds = batches.map((batch) => batch.id);

    // Supprimer toutes les transactions associées aux lots
    await prisma.transaction.deleteMany({
      where: {
        batchId: { in: batchIds },
      },
    });

    // Supprimer tous les lots associés à l'article
    await prisma.batch.deleteMany({
      where: {
        articleId: numericId,
      },
    });

    // Supprimer l'article lui-même
    const deletedArticle = await prisma.article.delete({
      where: { id: numericId },
    });

    // Retourner une réponse JSON confirmant la suppression
    return NextResponse.json({
      message: "Article, batches, and associated transactions deleted successfully",
      article: deletedArticle,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
