import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import prisma from '@/lib/prisma';
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

async function verifyToken(req: NextRequest) {
    // try {
        const authHeader = req.headers.get('Authorization');
        console.log("Authorization Header:", authHeader); // Log pour vérifier l'en-tête

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error("No token provided");
            return { error: "Unauthorized: No token provided", status: 401 };
        }

        const token = authHeader.split(' ')[1];
        console.log("Extracted Token:", token); // Log pour vérifier le token

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("Decoded Token:", decoded); // Log pour vérifier les données décodées

        return { user: decoded };
    // } catch (error) {
    //     console.error("Token verification error:", error.message);
    //     return { error: "Unauthorized: Invalid token", status: 401 };
    // }
}


export async function GET(req: NextRequest) {
    // Vérifier le token
    const tokenVerification = await verifyToken(req);
    if (tokenVerification.error) {
        return NextResponse.json(
            { message: tokenVerification.error },
            { status: tokenVerification.status }
        );
    }

    // Si le token est valide, exécutez la logique principale
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
}

export async function POST(req: Request) {
    try {
        // Récupérer les données de la requête
        const body = await req.json();
        const { email, password, role } = body;

        // Vérifier que tous les champs requis sont présents
        if (!email || !password || !role) {
            return NextResponse.json(
                { message: "Email, password, and role are required",icon:'error' },
                { status: 400 }
            );
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists",icon:'error' },
                { status: 409 }
            );
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
            },
        });

        // Retourner les informations utilisateur sans le mot de passe
        return NextResponse.json(
            {message: "User created successfully" , icon:'success'},{ status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { message: "An unexpected error occurred",icon:'error' },
            { status: 500 }
        );
    }
}
