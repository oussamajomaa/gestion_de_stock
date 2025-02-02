// Importation de Prisma pour interagir avec la base de données
import prisma from '@/lib/prisma';

// Importation de NextResponse pour gérer les réponses HTTP
import { NextRequest, NextResponse } from "next/server";

import { authMiddleware } from '@/services/authMiddleware';

// Fonction GET pour récupérer tous les articles
export async function GET(req: NextRequest) {
	// try {

	// Vérifier l'authentification avec le middleware
	const tokenVerification = authMiddleware(req);
	if (tokenVerification.error) {
		return NextResponse.json(
			{ message: tokenVerification.error },
			{ status: tokenVerification.status }
		);
	}
	// Récupère tous les articles avec leurs catégories et lots associés
	const articles = await prisma.article.findMany({
		include: {
			category: true, // Inclure les informations de la catégorie associée
			batches: true, // Inclure les lots associés
		},
	});

	// Calculer la quantité actuelle pour chaque article en fonction des lots
	const articlesWithQuantities = articles.map((article) => {
		let totalEntrées = 0;

		// Additionner les quantités des lots pour cet article
		article.batches.forEach((batch) => {
			totalEntrées += batch.quantity;
		});

		// Ajouter la quantité actuelle calculée à chaque article
		const currentQuantity = totalEntrées;

		return {
			...article, // Inclure toutes les propriétés de l'article
			current_quantity: currentQuantity, // Ajouter la quantité actuelle
		};
	});

	// Retourner les articles enrichis avec leurs quantités sous forme de JSON
	return NextResponse.json(articlesWithQuantities);
	// } catch (error: unknown) {
	// 	// Retourner une erreur en cas de problème
	// 	return NextResponse.json(JSON.stringify({ error: "Erreur lors de la récupération des articles" }),
	// 		{ status: 500 })
	// }
}

// Fonction POST pour ajouter un nouvel article
export async function POST(req: Request) {
	try {
		// Récupérer les données du corps de la requête
		const body = await req.json();
		const { article_name, article_description, barcode, quantity_min, unit, unit_price, categoryId } = body || {};

		// Créer un nouvel article dans la base de données
		await prisma.article.create({
			data: {
				article_name, // Nom de l'article
				article_description, // Description de l'article
				barcode, // Code-barres
				quantity_min: parseInt(quantity_min, 10), // Convertir la quantité minimale en entier
				unit, // Unité de mesure
				unit_price: parseFloat(unit_price), // Convertir le prix unitaire en nombre à virgule flottante
				category: categoryId ? { connect: { id: parseInt(categoryId, 10) } } : undefined, // Relier à une catégorie si elle est définie
			}
		});

		// Retourner une réponse JSON confirmant l'ajout de l'article
		return NextResponse.json({ message: 'Un article a été ajouté' });
	} catch (error: unknown) {
		// Retourner l'erreur en cas de problème
		return NextResponse.json(error);
	}
}
