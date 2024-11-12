import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function GET(request: Request, context: { params: { id: string } }) {
    const { id } = await context.params
    try {
        const numericId = parseInt(id, 10); // Convertit l'ID en nombre
        if (isNaN(numericId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        // Rechercher l'article par ID
        const transaction = await prisma.transaction.findUnique({
            where: { id: numericId },
        });

        if (!transaction) {
            return NextResponse.json({ error: "Transaction n'existe pas" }, { status: 404 });
        }

        return NextResponse.json(transaction);
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params;
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
        }

        // Lire les nouvelles données envoyées dans la requête
        const body = await request.json();
        console.log("Received body:", body);

        const { transaction_type, transaction_quantity, transaction_date, articleId, userId } = body || {};

        // Récupérez la transaction actuelle pour obtenir son ancienne quantité et type
        const existingTransaction = await prisma.transaction.findUnique({
            where: { id: numericId },
        });

        if (!existingTransaction) {
            return NextResponse.json({ message: "Transaction non trouvée." }, { status: 404 });
        }

        // Récupérez l'article actuel pour obtenir sa quantité actuelle
        const article = await prisma.article.findUnique({
            where: { id: parseInt(articleId, 10) },
            select: { article_quantity: true },
        });

        if (!article) {
            return NextResponse.json({ message: "Article non trouvé." }, { status: 404 });
        }

        // Réajustez la quantité de l'article en fonction de l'ancienne transaction
        let adjustedQuantity = article.article_quantity;

        if (existingTransaction.transaction_type.toLowerCase() === "sortie") {
            adjustedQuantity += existingTransaction.transaction_quantity;
        } else {
            adjustedQuantity -= existingTransaction.transaction_quantity;
        }

        // Vérifier la quantité si la nouvelle transaction est une "sortie"
        if (transaction_type.toLowerCase() === "sortie" && transaction_quantity > adjustedQuantity) {
            return NextResponse.json(
                { message: "La quantité de la transaction dépasse la quantité disponible." },
                { status: 400 }
            );
        }

        // Mettez à jour la transaction avec les nouvelles données
        const updatedTransaction = await prisma.transaction.update({
            where: { id: numericId },
            data: {
                transaction_type,
                transaction_quantity: parseFloat(transaction_quantity),
                transaction_date: new Date(transaction_date),
                article: articleId ? { connect: { id: parseInt(articleId, 10) } } : undefined,
                user: userId ? { connect: { id: parseInt(userId, 10) } } : undefined,
            },
        });

        // Recalculer la nouvelle quantité de l'article
        const finalQuantity = transaction_type.toLowerCase() === "sortie"
            ? adjustedQuantity - parseFloat(transaction_quantity)
            : adjustedQuantity + parseFloat(transaction_quantity);

        // Mettez à jour la quantité de l'article
        await prisma.article.update({
            where: { id: parseInt(articleId, 10) },
            data: { article_quantity: finalQuantity },
        });

        return NextResponse.json({ message: "La transaction a été mise à jour." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la transaction:", error);
        return NextResponse.json(
            { message: "Une erreur est survenue lors de la mise à jour de la transaction." },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params
        const numericId = parseInt(id, 10);

        if (isNaN(numericId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        // Récupérez la transaction actuelle pour obtenir son ancienne quantité et type
        const existingTransaction = await prisma.transaction.findUnique({
            where: { id: numericId },
        });

        if (!existingTransaction) {
            return NextResponse.json({ message: "Transaction non trouvée." }, { status: 404 });
        }

        const articleId = existingTransaction.articleId

        // Récupérez l'article actuel pour obtenir sa quantité actuelle
        const article = await prisma.article.findUnique({
            where: { id: articleId },
            select: { article_quantity: true },
        });

        if (!article) {
            return NextResponse.json({ message: "Article non trouvé." }, { status: 404 });
        }

        // Réajustez la quantité de l'article en fonction de l'ancienne transaction
        let adjustedQuantity = article.article_quantity;

        if (existingTransaction.transaction_type.toLowerCase() === "sortie") {
            adjustedQuantity += existingTransaction.transaction_quantity;
        } else {
            adjustedQuantity -= existingTransaction.transaction_quantity;
        }

        // Mettez à jour la quantité de l'article
        await prisma.article.update({
            where: { id: articleId },
            data: { article_quantity: adjustedQuantity },
        });


        const deletedArticle = await prisma.transaction.delete({
            where: { id: numericId },
        });

        return NextResponse.json({ message: "Transaction supprimée avec succès" });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }

}