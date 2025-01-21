// Activation du mode "use client" pour rendre ce composant côté client
"use client";

// Importation des hooks React pour gérer l'état, les effets secondaires et les fonctions
import { useEffect, useState, useCallback } from "react";

// Importation des outils de navigation Next.js
import { useParams, useRouter } from "next/navigation";

// Importation des types nécessaires
import { Article } from "@/types/article";
import { Category } from "@/types/category";

// Importation de l'icône pour le bouton retour et de la bibliothèque SweetAlert2 pour les alertes
import { IoIosArrowBack } from "react-icons/io";
import Swal from 'sweetalert2';

// Importation du composant personnalisé pour le formulaire d'article
import ArticleForm from "@/components/ArticleForm";

// Composant principal pour la page d'édition
export default function EditPage() {
    // Récupération des paramètres d'URL
    const { id } = useParams();

    // Initialisation des outils de navigation
    const router = useRouter();

    // États pour gérer les catégories, l'article et les données du formulaire
    const [categories, setCategories] = useState<Category[]>([]);
    const [article, setArticle] = useState<Article | null>(null);
    const [formData, setFormData] = useState({
        article_name: "",
        article_description: "",
        barcode: "",
        quantity_min: 0,
        unit: "",
        unit_price: 0,
        categoryId: "" as number | ""
    });

    // Fonction pour récupérer les données d'un article spécifique
    const fetchArticle = useCallback(async () => {
        const response = await fetch(`/api/article/${id}`); // Appel de l'API pour l'article
        if (response.ok) {
            const data = await response.json();
            setArticle(data); // Mise à jour de l'état avec les données de l'article
            setFormData({
                article_name: data.article_name,
                article_description: data.article_description,
                barcode: data.barcode,
                quantity_min: data.quantity_min,
                unit: data.unit,
                unit_price: data.unit_price,
                categoryId: data.categoryId || "",
            });
        }
    }, [id]);

    // Fonction pour récupérer la liste des catégories disponibles
    const fetchCategories = async () => {
        const response = await fetch("/api/category"); // Appel de l'API pour les catégories
        if (response.ok) {
            const data = await response.json();
            setCategories(data); // Mise à jour de l'état avec les catégories
        }
    };

    // Effet pour charger les données au montage du composant
    useEffect(() => {
        fetchArticle();
        fetchCategories();
    }, [fetchArticle]);

    // Fonction pour mettre à jour les informations de l'article
    const updateArticle = async () => {
        const response = await fetch(`/api/article/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData) // Envoi des données mises à jour
        });

        if (response.ok) {
            await response.json();
            router.push('/article'); // Redirection vers la page des articles
            Swal.fire({
                html: `L'article <span style="color: red;">${formData.article_name}</span> a été mis à jour avec succès !`,
                icon: "success",
            });
        } else {
            Swal.fire('Erreur', "Une erreur est survenue lors de la mise à jour de l'article.", 'error');
        }
    };

    // Gestion des changements dans les champs du formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "article_quantity" || name === "quantity_min" || name === "unit_price" || name === "categoryId"
                ? parseFloat(value) // Conversion en nombre pour certains champs
                : value // Sinon, utilisation de la valeur directement
        });
    };

    // Empêche la soumission par défaut et déclenche la mise à jour de l'article
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateArticle();
    };

    // Affichage d'un message de chargement si les données ne sont pas encore disponibles
    if (!article ) {
        return <div>Loading...</div>;
    }

    // Rendu du composant principal
    return (
        <div className="h-[calc(100vh-104px)] flex items-center justify-center">

            {article ? (
                <div className="w-1/2 m-auto max-xl:w-full shadow-2xl rounded-2xl p-10">
                    {/* Bouton pour revenir en arrière */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 mb-3"
                    >
                        <IoIosArrowBack size={24} />
                        Retour
                    </button>

                    {/* Titre de la page */}
                    <h1 className="text-3xl font-bold mb-3">Editer un article</h1>

                    {/* Formulaire pour modifier l'article */}
                    <ArticleForm 
                        onSubmit={handleSubmit}
                        onChange={handleChange}
                        formData={formData}
                        categories={categories}
                    />
                </div>
            ) : (
                <p>Chargement des données...</p>
            )}
        </div>
    )
}
