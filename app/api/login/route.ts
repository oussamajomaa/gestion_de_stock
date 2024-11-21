import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
	try {
		// Parse le corps de la requête
		const body = await req.json();
		const { email, password } = body;

		// Vérifie si l'utilisateur existe dans la base de données
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return NextResponse.json({ error: "Invalid email or password",icon:"error" }, { status: 401 });
		}

		// Vérifie le mot de passe avec bcrypt
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return NextResponse.json({ message: "Invalid email or password",icon:"error" }, { status: 401 });
		}

		// Génère un token JWT (ajustez la clé secrète et les options selon vos besoins)
		const token = jwt.sign(
			{ id: user.id, email: user.email, role: user.role },
			process.env.JWT_SECRET || "default_secret", // Remplacez par une clé secrète sécurisée dans .env
			{ expiresIn: "1h" }
		);

		// Retourne la réponse avec les informations utilisateur et le token
		return NextResponse.json(
			{
				id: user.id,
				email: user.email,
				role: user.role,
				token,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error during login:", error);
		return NextResponse.json({ message: "An unexpected error occurred",icon:"error" }, { status: 500 });
	}
}
