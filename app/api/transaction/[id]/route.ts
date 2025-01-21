import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET(request: Request, { params} :any) {
    const { id } = await params
    try {
        const numericId = parseInt(id, 10); // Convertit l'ID en nombre
        if (isNaN(numericId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        // Rechercher la transaction par ID
        const transaction = await prisma.transaction.findUnique({
            where: { id: numericId },
            include: {
                batch: {
                    include: {
                        article: true, // Inclure les détails de l'article
                    },
                },
            },
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

export async function PUT(request: Request, { params} :any) {
    const { id } = await params; // Attente explicite de `context.params`
    try {
        const numericId = parseInt(id, 10); // Convertit l'ID en nombre
        if (isNaN(numericId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const body = await request.json();
        const { transaction_quantity, transaction_date } = body;

        // Récupérer la transaction existante avec son lot associé
        const existingTransaction = await prisma.transaction.findUnique({
            where: { id: numericId },
            include: {
                batch: true, // Inclure le lot pour ajuster les quantités
            },
        });

        if (!existingTransaction) {
            return new Response(JSON.stringify({ error: "Transaction introuvable" }), { status: 404 });
        }

        const previousQuantity = existingTransaction.transaction_quantity;
        const batch = existingTransaction.batch;

        // Ajuster la quantité dans le batch selon le type de transaction
        if (batch) {
            if (existingTransaction.transaction_type === "Entrée") {
                // Si transaction est "Entrée", soustraire l'ancienne quantité et ajouter la nouvelle
                const quantityAdjustment = transaction_quantity - previousQuantity;
                await prisma.batch.update({
                    where: { id: batch.id },
                    data: {
                        quantity: batch.quantity + quantityAdjustment,
                    },
                });
            } else if (existingTransaction.transaction_type === "Sortie") {
                // Si transaction est "Sortie", ajouter l'ancienne quantité et soustraire la nouvelle
                const quantityAdjustment = previousQuantity - transaction_quantity;
                await prisma.batch.update({
                    where: { id: batch.id },
                    data: {
                        quantity: batch.quantity + quantityAdjustment,
                    },
                });
            }
        }

        // Mettre à jour la transaction
        const updatedTransaction = await prisma.transaction.update({
            where: { id: numericId },
            data: {
                ...(transaction_quantity !== undefined && {
                    transaction_quantity,
                }),
                ...(transaction_date && {
                    transaction_date: new Date(transaction_date),
                }),
            },
        });


        return NextResponse.json({
            message: "Transaction mise à jour avec succès",
            transaction: updatedTransaction,
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Erreur interne du serveur" }), { status: 500 });
    }
}

export async function DELETE(request: Request, { params} :any) {
    const { id } = params;
    try {
        const numericId = parseInt(id, 10); // Convertir l'ID en nombre
        if (isNaN(numericId)) {
            return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
        }

        // Récupérer la transaction existante
        const transaction = await prisma.transaction.findUnique({
            where: { id: numericId },
            include: {
                batch: true, // Inclure les informations du lot associé
            },
        });

        if (!transaction) {
            return new Response(JSON.stringify({ error: "Transaction introuvable" }), { status: 404 });
        }

        // Vérifier si la suppression peut être effectuée
        if (transaction.transaction_type === "Entrée") {
            // Si c'est une entrée, vérifier que la quantité dans le lot après suppression ne deviendrait pas négative
            if (transaction.batch.quantity < transaction.transaction_quantity) {
                return new Response(
                    JSON.stringify({ message: "La suppression entraînerait une quantité négative dans le lot" }),
                    { status: 400 }
                );
            }

            // Réduire la quantité pour une entrée
            await prisma.batch.update({
                where: { id: transaction.batchId },
                data: {
                    quantity: transaction.batch.quantity - transaction.transaction_quantity,
                },
            });
        } else if (transaction.transaction_type === "Sortie") {
            // Augmenter la quantité pour une sortie
            await prisma.batch.update({
                where: { id: transaction.batchId },
                data: {
                    quantity: transaction.batch.quantity + transaction.transaction_quantity,
                },
            });
        }

        // Supprimer la transaction
        await prisma.transaction.delete({
            where: { id: numericId },
        });

        return NextResponse.json({ message: "Transaction supprimée avec succès" }, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la suppression de la transaction :", error);
        return new Response(
            JSON.stringify({ error: "Erreur interne du serveur" }),
            { status: 500 }
        );
    }
}