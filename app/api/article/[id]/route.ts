import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request, context: { params: { id: string } }) {
    const { id } = await context.params; // Attente explicite de `context.params`

    try {
        const numericId = parseInt(id, 10); // Convertit l'ID en nombre
        if (isNaN(numericId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        // Rechercher l'article par ID
        const article = await prisma.article.findUnique({
            where: { id: numericId },
            include:{batches:true}
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

export async function PUT(request: Request, context: { params: { id: string } }) {
    const { id } = await context.params;

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Lire les données envoyées dans la requête
    const body = await request.json();
    console.log("Received data:", body);

    // Extraire `formData` des données
    const { article_name, article_description, barcode, quantity_min, unit, unit_price, categoryId } = body || {}


    // Validation des champs pour éviter `undefined` ou `NaN`
    const updatedData = {
        article_name,
        article_description,
        barcode,
        quantity_min: parseFloat(quantity_min),
        unit,
        unit_price: parseFloat(unit_price),
        category: categoryId ? { connect: { id: parseInt(categoryId, 10) } } : undefined, // Mettre à jour la catégorie
    };

    // Mettre à jour l'article dans la base de données
    try {
        await prisma.article.update({
            where: { id: numericId },
            data: updatedData,
        });

        return NextResponse.json({ message: 'Un article a été mis à jour' });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
    const { id } = await context.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        // Trouver tous les batches associés à cet article
        const batches = await prisma.batch.findMany({
            where: {
                articleId: numericId,
            },
        });

        // Extraire les IDs des batches
        const batchIds = batches.map(batch => batch.id);

        // Supprimer toutes les transactions associées aux batches de cet article
        await prisma.transaction.deleteMany({
            where: {
                batchId: { in: batchIds },
            },
        });

        // Supprimer tous les batches associés à cet article
        await prisma.batch.deleteMany({
            where: {
                articleId: numericId,
            },
        });

        // Supprimer l'article lui-même
        const deletedArticle = await prisma.article.delete({
            where: { id: numericId },
        });

        return NextResponse.json({ message: "Article, batches, and associated transactions deleted successfully", article: deletedArticle });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

