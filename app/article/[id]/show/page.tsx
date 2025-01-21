"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Article } from "@/types/article";
import { IoIosArrowBack } from "react-icons/io";

export default function Page() {

    const { id } = useParams(); // Récupère l'ID de l'article
    const [article, setArticle] = useState<Article | null>(null);
    const router = useRouter()
    const fetchArticle = async () => {
        const response = await fetch(`/api/article/${id}`); // Ajout de "/" au début pour indiquer la racine de l'API
        if (response.ok) {
            const data = await response.json();
            setArticle(data); // Met à jour l'état avec les données de l'article
         
        } else {
            console.error("Erreur lors de la récupération de l'article");
        }
    };

    useEffect(() => {
        fetchArticle();
    }, [id]); // Ajout de `id` comme dépendance pour s'assurer qu'on récupère les données si `id` change

    if (!article) return <p>Chargement...</p>; // Affiche un message de chargement si l'article n'est pas encore disponible
  
    return (
        <div className="h-[calc(100vh-104px)] flex items-center">

            <div className="w-1/2 m-auto max-xl:w-full shadow-2xl rounded-2xl p-10">
                <button
                    onClick={() => router.back()}
                    className="flex items-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 mb-3"
                >
                    <IoIosArrowBack size={24} className="mr-2" />
                    Retour
                </button>
                <h1 className="text-3xl font-bold mb-3">Détails de l&apos;Article</h1>
               
                    <div className="mb-4">
                        <label className="block">Nom de l&apos;article</label>
                        <input type="text" name="article_name" readOnly value={article.article_name} className="input input-bordered w-full" required />
                    </div>

                    <div className="mb-4">
                        <label className="block">Description</label>
                        <textarea name="article_description" readOnly value={article.article_description} className="textarea textarea-bordered w-full" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 ">
                        <div className="mb-4 ">
                            <label className="block">Quantité minimale</label>
                            <input type="number" name="quantity_min" readOnly value={article.quantity_min} className="input input-bordered w-full" required />
                        </div>
                        
                    </div>

                    <div className="grid grid-cols-2 gap-2 ">
                        <div className="mb-4">
                            <label className="block">Code-barres</label>
                            <input type="text" name="barcode" readOnly value={article.barcode} className="input input-bordered w-full" required />
                        </div>
                     
                    </div>

                    <div className="grid grid-cols-2 gap-2 ">
                        <div className="mb-4">
                            <label className="block">Unité</label>
                            <input type="text" name="unit" readOnly value={article.unit} className="input input-bordered w-full" required />
                        </div>
                        <div className="mb-4">
                            <label className="block">Prix unitaire</label>
                            <input type="number" name="unit_price" readOnly value={article.unit_price} className="input input-bordered w-full" required />
                        </div>
                    </div>console

                
            </div>
        </div>
    );
}
