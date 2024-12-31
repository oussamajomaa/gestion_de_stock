import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';


export async function GET() {
    try {
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
                }
            },
            include:{article:true}
        });

        // Récupérer les articles déjà expirés (expiration_date <= aujourd'hui)
        const articlesExpired = await prisma.batch.findMany({
            where: {
                expiration_date: {
                    lte: today // expiration_date <= aujourd'hui
                },
                quantity:{
                    gt:0
                }
            },
            include:{article:true}
        });

        // Retourner les deux listes d'articles
        return NextResponse.json({ articlesExpiringSoon, articlesExpired });
    } catch (error) {
        console.error("Erreur lors de la récupération des articles:", error);
        return NextResponse.json({ message: "Erreur serveur lors de la récupération des articles." }, { status: 500 });
    }
}
