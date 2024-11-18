import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const articles = await prisma.article.findMany();

        // Use a for...of loop to handle async operations inside the loop
        for (const article of articles) {
            // Create a new batch for each article
            const newBatch = await prisma.batch.create({
                data: {
                    articleId: article.id,
                    expiration_date: article.expiration_date,
                    quantity: article.article_quantity,
                },
            });

            // After the batch is created, use its ID in the transaction creation
            await prisma.transaction.create({
                data: {
                    transaction_date: new Date(),
                    transaction_type: "Entrée",
                    transaction_quantity: article.article_quantity,
                    batchId: newBatch.id, // Use the ID from the created batch
                    userId: 1, // Assuming userId 1; adjust if necessary
                },
            });
        }

        return NextResponse.json({ message: "Batches and transactions created successfully." });
    } catch (error) {
        console.error("Error during batch and transaction creation:", error);
        return NextResponse.json({ error: "An error occurred during batch and transaction creation." }, { status: 500 });
    }
}
