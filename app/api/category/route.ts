import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";



const prisma = new PrismaClient()

export async function GET() {

    try {
        const categories = await prisma.category.findMany()
        return NextResponse.json(categories)
    } catch (error) {
        return NextResponse.json(error)
    }
}