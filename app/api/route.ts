import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

// const prisma = new PrismaClient()
export async function GET() {
    // try {
        const articles = await prisma.article.findMany({
            include: {
                batches: {
                    where: {
                        quantity: {
                            not: 0, // Exclut les batches avec quantité = 0
                        },
                    },
                    select: {
                        quantity: true,
                        expiration_date: true,
                    },
                },
            },
        });
        // Ajouter le total des quantités à chaque article
        const articlesWithTotal = articles.map(article => {
            const totalQuantity = article.batches.reduce((sum, batch) => sum + batch.quantity, 0);
            return {
                ...article,
                totalQuantity,
            };
        });

        // Définir la date d'aujourd'hui
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ignorer l'heure pour inclure toute la journée

        // Définir la date de fin comme 10 jours après aujourd'hui
        const tenDaysLater = new Date();
        tenDaysLater.setDate(today.getDate() + 10);
        tenDaysLater.setHours(23, 59, 59, 999); // Inclure toute la journée de fin

        // Récupérer les articles qui expirent dans les 10 prochains jours
        const articlesExpiringSoon = await prisma.batch.findMany({
            where: {
                expiration_date: {
                    gte: today,       // expiration_date >= aujourd'hui
                    lte: tenDaysLater // expiration_date <= aujourd'hui + 10 jours
                },
                quantity: {
                    gt:0
                }
            
            },
            // orderBy:{
            //         expiration_date:'asc'
            // },
            include: { article: true }
        });
        
        // Ajouter le calcul des jours restants
        const batchesWithDaysRemaining = articlesExpiringSoon.map((batch) => {
            const expirationDate = new Date(batch.expiration_date!); // Convertir en objet Date si nécessaire
            const timeDifference = expirationDate.getTime() - today.getTime(); // Différence en millisecondes
            const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convertir en jours

            return {
                ...batch,
                daysRemaining, // Ajouter les jours restants
            };
        });

        // Récupérer les articles déjà expirés (expiration_date <= aujourd'hui)
        const allArticlesExpired = await prisma.batch.findMany({
            where: {
                expiration_date: {
                    lte: today // expiration_date <= aujourd'hui
                }
            },
            include: { article: true }
        });


        const articlesExpired = allArticlesExpired.filter(article => article.quantity > 0)
        // Filtrer les articles dont le total des quantités est inférieur ou égal à quantity_min
        const articleToBeSupplied = articlesWithTotal.filter(article => article.totalQuantity <= article.quantity_min);

        const articlesSortie = await prisma.article.findMany({
            select: {
                id: true,
                article_name: true,
                unit: true,
                batches: {
                    select: {
                        transactions: {
                            where: {
                                transaction_type: 'sortie',
                            },
                            select: {
                                transaction_quantity: true,
                            },
                        },
                    },
                },
            },
        });

        // Calculer la quantité totale pour chaque article
        const articlesConsumed = articlesSortie
            .map((article) => ({
                ...article,
                totalQuantity: article.batches
                    .flatMap((batch) => batch.transactions)
                    .reduce((sum, txn) => sum + txn.transaction_quantity, 0),
            }))
            .sort((a, b) => b.totalQuantity - a.totalQuantity)
            .slice(0, 5);



        return NextResponse.json({ articleToBeSupplied, articlesExpired, batchesWithDaysRemaining, articlesConsumed });

    // } catch (error) {

    // }
}