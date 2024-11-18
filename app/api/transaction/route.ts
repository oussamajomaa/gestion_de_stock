import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET() {
    try {
        const transactions = await prisma.transaction.findMany({
            include: {
                batch: {
                    include: {
                        article: true, // Inclure l'article associé au batch
                    },
                },
            },
            orderBy: {
                transaction_date: "desc", // Trier par date de transaction en ordre décroissant (la plus récente en premier)
            },
        })
        return NextResponse.json(transactions)
    } catch (error) {
        return NextResponse.json(error)
    }
}

export async function POST(req:Request) {
    try {
        const body = await req.json();
        
        const { transaction_type, userId, articleId, transaction_quantity, transaction_date, batch_expiration_date } = body;

        if (!transaction_type || !userId || !articleId || !transaction_quantity) {
            return new Response(JSON.stringify({ error: "Invalid input" }), {
                status: 400,
            });
        }

        if (transaction_type === "Entrée") {
            // Chercher un lot existant avec le même article et date d'expiration
            let batch = await prisma.batch.findFirst({
                where: {
                    articleId,
                    expiration_date: new Date(batch_expiration_date),
                },
            });

            console.log(batch);
            

            if (batch) {
                // Mettre à jour la quantité du lot existant
                batch = await prisma.batch.update({
                    where: { id: batch.id },
                    data: { quantity: batch.quantity + transaction_quantity },
                });
            } else {
                // Créer un nouveau lot
                batch = await prisma.batch.create({
                    data: {
                        articleId,
                        expiration_date: new Date(batch_expiration_date),
                        quantity:transaction_quantity,
                        status: "active",
                    },
                });
            }

            // Enregistrer la transaction
            await prisma.transaction.create({
                data: {
                    transaction_date: new Date(transaction_date),
                    transaction_quantity: transaction_quantity,
                    transaction_type: "Entrée",
                    userId,
                    batchId: batch.id,
                },
            });

            return new Response(JSON.stringify({ message: "Transaction entrée enregistrée avec succès" }), {
                status: 200,
            });
        } else if (transaction_type === "Sortie") {
            // Récupérer les lots avec l'article concerné, triés par date d'expiration
            const batches = await prisma.batch.findMany({
                where: { articleId },
                orderBy: { expiration_date: "asc" },
            });

            // Vérifier si la quantité totale disponible est suffisante
            const totalAvailableQuantity = batches.reduce(
                (sum, batch) => sum + batch.quantity,
                0
            );

            if (totalAvailableQuantity < transaction_quantity) {
                return new Response(
                    JSON.stringify({
                        message: "Quantité insuffisante en stock",
                    }),
                    { status: 400 }
                );
            }

            // Déduire la quantité des lots
            let remainingQuantity = transaction_quantity;

            for (const batch of batches) {
                if (remainingQuantity <= 0) break;

                if (batch.quantity >= remainingQuantity) {
                    // Déduire la quantité du lot
                    await prisma.batch.update({
                        where: { id: batch.id },
                        data: { quantity: batch.quantity - remainingQuantity },
                    });

                    // Enregistrer la transaction
                    await prisma.transaction.create({
                        data: {
                            transaction_date: new Date(transaction_date),
                            transaction_quantity: remainingQuantity,
                            transaction_type: "Sortie",
                            userId,
                            batchId: batch.id,
                        },
                    });

                    remainingQuantity = 0;
                } else {
                    let batch_qty = batch.quantity
                    // Consommer entièrement ce lot
                    await prisma.batch.update({
                        where: { id: batch.id },
                        data: { quantity: 0 },
                    });

                    // Enregistrer une transaction partielle
                    if (batch_qty > 0) {
                        await prisma.transaction.create({
                            data: {
                                transaction_date: new Date(transaction_date),
                                transaction_quantity: batch.quantity,
                                transaction_type: "Sortie",
                                userId,
                                batchId: batch.id,
                            },
                        });
                    }

                    remainingQuantity -= batch.quantity;
                }
            }

            return new Response(
                JSON.stringify({
                    message: "Transaction sortie enregistrée avec succès",
                }),
                { status: 200 }
            );
        }

        return new Response(
            JSON.stringify({ error: "Type de transaction invalide" }),
            { status: 400 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: "Erreur interne du serveur" }),
            { status: 500 }
        );
    }
}