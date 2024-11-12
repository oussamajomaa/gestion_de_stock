import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET() {
    try {
        const transactions = await prisma.transaction.findMany({
            include: {
                article: true, // Assurez-vous d'inclure l'article
                user: true     // Inclure aussi l'utilisateur si nécessaire
            }
        });
        return NextResponse.json(transactions)
    } catch (error) {
        return NextResponse.json(error)
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { transaction_type, transaction_quantity, transaction_date, articleId, userId } = body || {};

        console.log('Transaction data:', {
            transaction_type,
            transaction_quantity,
            transaction_date,
            articleId,
            userId,
        });



        // Récupérez l'article actuel pour obtenir sa quantité actuelle
        const article = await prisma.article.findUnique({
            where: { id: parseInt(articleId, 10) }
        });

        if (!article) {
            return NextResponse.json(
                { error: "Article non trouvé." },
                { status: 404 }
            );
        }

        // Vérifier la quantité si la transaction est une "sortie"
        if (transaction_type.toLowerCase() === "sortie" && transaction_quantity > article.article_quantity) {
            return NextResponse.json(
                { message: "La quantité de la transaction dépasse la quantité disponible." },
                { status: 400 }
            );
        }

        const newTransaction = await prisma.transaction.create({
            data: {
                transaction_type,
                transaction_quantity: parseFloat(transaction_quantity),
                transaction_date: new Date(transaction_date), // Assurez-vous que c'est bien une date
                article: articleId ? { connect: { id: parseInt(articleId, 10) } } : undefined,
                user: userId ? { connect: { id: parseInt(userId, 10) } } : undefined,
            }
        });

        // Calculez la nouvelle quantité en fonction du type de transaction
        const updateQuantity = transaction_type.toLowerCase() === 'sortie'
            ? article.article_quantity - parseFloat(transaction_quantity)
            : article.article_quantity + parseFloat(transaction_quantity)

        // Mettez à jour la quantité de l'article
        await prisma.article.update({
            where: { id: articleId },
            data: {
                article_quantity: updateQuantity
            }
        })

        return NextResponse.json({ message: 'Une transaction a été ajoutée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la création de la transaction:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue lors de la création de la transaction.' },
            { status: 500 }
        );
    }
}
