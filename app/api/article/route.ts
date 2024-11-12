import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()
export async function GET() {
	try {
		const articles = await prisma.article.findMany({
			include: {
				category: true
			},
		});

		return new Response(JSON.stringify(articles), { status: 200 })
	} catch (error) {
		return new Response(JSON.stringify({ error: "Erreur lors de la récupération des articles" }), { status: 500 })
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json()
		const { article_name, article_description, article_quantity, barcode, expiration_date, quantity_min, unit, unit_price,categoryId } = body || {}
		
		const newArticle = await prisma.article.create({
			data: {
				article_name,
				article_description,
				article_quantity: parseInt(article_quantity, 10), // Convertit en `Int`
				barcode,
				expiration_date: new Date(expiration_date),
				quantity_min: parseInt(quantity_min, 10), // Convertit en `Int`
				unit,
				unit_price: parseFloat(unit_price), // Convertit en `Float`
				category: categoryId ? { connect: { id: parseInt(categoryId, 10) } } : undefined, // Relier la catégorie si `categoryId` est défini
			}
		});
		return NextResponse.json({ message: 'Un article a été ajouté' })
	} catch (error) {
		return NextResponse.json(error)
	}
}
