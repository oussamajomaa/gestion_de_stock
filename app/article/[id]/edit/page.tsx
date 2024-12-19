"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Article } from "@/types/article";
import { IoIosArrowBack } from "react-icons/io";
import Swal from 'sweetalert2';
import { Category } from "@/types/category";
import { FiSave } from "react-icons/fi";
import { fetchArticleById } from "@/services/articleService";
import ArticleForm from "@/components/ArticleForm";


export default function page() {
    const { id } = useParams();
    const router = useRouter();
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [article, setArticle] = useState<Article | null>(null);
    const [formData, setFormData] = useState({
        article_name: "",
        article_description: "",
        barcode: "",
        // expiration_date: "",
        quantity_min: 0,
        unit: "",
        unit_price: 0,
        categoryId: "" as number | ""
    });

    // Récupère l'article existant pour pré-remplir le formulaire
    const fetchArticle = async () => {
        const response = await fetch(`/api/article/${id}`);
        if (response.ok) {
            const data = await response.json();
            setArticle(data);
            console.log(data)


            // Mettez à jour formData avec les valeurs de data.article et data.batch
            setFormData({
                article_name: data.article_name,
                article_description: data.article_description,
                barcode: data.barcode,
                quantity_min: data.quantity_min,
                unit: data.unit,
                unit_price: data.unit_price,
                categoryId: data.categoryId || ""
            });
        }
    };

    const fetchCategories = async () => {
        const response = await fetch("/api/category"); // Remplacez par votre endpoint
        if (response.ok) {
            const data = await response.json();
            setCategories(data);
        }
    };

    useEffect(() => {
        fetchArticle();
        fetchCategories();
    }, []);


    const updateArticle = async () => {
        const response = await fetch(`/api/article/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const data = await response.json();
            router.push('/article');
            Swal.fire({
                html: `L'article <span style="color: red;">${formData.article_name}</span> a été mis à jour avec succès !`,
                icon: "success",
            });
        } else {
            Swal.fire('Erreur', "Une erreur est survenue lors de la mise à jour de l'article.", 'error');
        }
    };

    // Gère les changements dans le formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "article_quantity" || name === "quantity_min" || name === "unit_price" || name === "categoryId"
                ? parseFloat(value)
                : value
        });
    };

    // Empêche la soumission par défaut et appelle `updateArticle`
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateArticle();
    };

    if (!article ) {
        return <div>Loading...</div>;
    }
    return (
        <div className="h-[calc(100vh-104px)] flex items-center justify-center">

            {article ? (<div className="w-1/2 m-auto max-xl:w-full shadow-2xl rounded-2xl p-10">
                <button
                    onClick={() => router.back()}
                    className="flex items-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 mb-3"
                >
                    <IoIosArrowBack size={24} />
                    Retour
                </button>
                <h1 className="text-3xl font-bold mb-3">Editer un article</h1>

                <ArticleForm 
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                    formData={formData}
                    categories={categories}
                />
            </div>
            ) : (
                <p>Chargement des données de l'article...</p>
            )}
        </div>
    )
}
