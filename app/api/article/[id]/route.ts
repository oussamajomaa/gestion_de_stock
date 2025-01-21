import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET(request: NextRequest, { params }: any) {
  const { id } = params;

  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const article = await prisma.article.findUnique({
      where: { id: numericId },
      include: { batches: true },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: any) {
  const { id } = params;

  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { article_name, article_description, barcode, quantity_min, unit, unit_price, categoryId } = body || {};

    const updatedData = {
      article_name,
      article_description,
      barcode,
      quantity_min: parseFloat(quantity_min),
      unit,
      unit_price: parseFloat(unit_price),
      category: categoryId ? { connect: { id: parseInt(categoryId, 10) } } : undefined,
    };

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

export async function DELETE(request: NextRequest, { params }: any) {
  const { id } = params;

  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const batches = await prisma.batch.findMany({
      where: { articleId: numericId },
    });

    const batchIds = batches.map((batch) => batch.id);

    await prisma.transaction.deleteMany({
      where: {
        batchId: { in: batchIds },
      },
    });

    await prisma.batch.deleteMany({
      where: {
        articleId: numericId,
      },
    });

    const deletedArticle = await prisma.article.delete({
      where: { id: numericId },
    });

    return NextResponse.json({
      message: "Article, batches, and associated transactions deleted successfully",
      article: deletedArticle,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
