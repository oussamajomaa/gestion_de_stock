import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';


export async function DELETE(request: Request, context: { params: { id: string } }) {
    const { id } = await context.params;
    try {
        const numericId = parseInt(id, 10); // Convertir l'ID en nombre
        if (isNaN(numericId)) {
            return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
        }
        await prisma.transaction.deleteMany({
            where: {
                batchId:numericId
            }
        })
        await prisma.batch.delete({
            where: {
                id: numericId
            }
        });

        const today = new Date(); // Date actuelle

        return NextResponse.json({ message: "Articles supprimés avec succès" }, { status: 200 });
        // return new Response(JSON.stringify({ message: "Batch deleted successfully" }), { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la suppression des article :", error);
        return new Response(
            JSON.stringify({ error: "Erreur interne du serveur" }),
            { status: 500 }
        );
    }
}