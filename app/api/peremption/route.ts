import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Créer une instance de la date d'aujourd'hui
        // const today = new Date();

        // Calculer la date 10 jours à partir d'aujourd'hui
        // const targetDate = new Date(today.setDate(today.getDate() + 10));

        // console.log(targetDate);
        

        // // Définir le début et la fin de la journée cible pour ignorer l'heure
        // const startOfTargetDate = new Date(targetDate.setHours(0, 0, 0, 0));
        // const endOfTargetDate = new Date(targetDate.setHours(23, 59, 59, 999));

        // Définir le début de la journée d'aujourd'hui pour ignorer l'heure
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);



         // Calculer les dates limites
        const today = new Date();
        const tenDaysLater = new Date();
        tenDaysLater.setDate(today.getDate() + 10);

        // Récupérer les articles dont la date d'expiration est entre aujourd'hui et dans 10 jours
        const articles = await prisma.article.findMany({
            where: {
                expiration_date: {
                    gte: today,       // expiration_date >= aujourd'hui
                    lte: tenDaysLater // expiration_date <= aujourd'hui + 10 jours
                }
            }
        });

         
        // Requête pour récupérer les articles dont la date d'expiration est exactement `targetDate` (peu importe l'heure)
        const articleExpired = await prisma.article.findMany({
            where: {
                expiration_date: {
                    // gte: startOfTargetDate,  // Début de la journée cible
                    lt: startOfToday      // Fin de la journée cible
                },
            },
        });

        return NextResponse.json({articles,articleExpired});
    } catch (error) {
        console.error("Erreur lors de la récupération des articles:", error);
        return NextResponse.json({ message: error });
    }
}
