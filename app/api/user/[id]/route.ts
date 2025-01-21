import { NextResponse } from "next/server";

import prisma from '@/lib/prisma';
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET(request: Request, { params }:any) {
    const { id } = await params; // Attente explicite de `context.params`

    try {
        const numericId = parseInt(id, 10); // Convertit l'ID en nombre
        if (isNaN(numericId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        // Rechercher l'article par ID
        const user = await prisma.user.findUnique({
            where: { id: numericId },
        });

        if (!user) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }:any) {
    const { id } = await params;

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Lire les données envoyées dans la requête
    const body = await request.json();

    // Extraire `formData` des données
    const { role } = body || {}

    // Mettre à jour l'article dans la base de données
    try {
        await prisma.user.update({
            where: { id: numericId },
            data: {role},
        });

        return NextResponse.json({ message: 'Un utilisateur a été mis à jour' });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }:any) {
    const { id } = await params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        // Supprimer l'utilisateur 
        await prisma.user.delete({
            where: { id: numericId },
        });

        return NextResponse.json({ message: "L'utilisateur a été supprimé"});
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

