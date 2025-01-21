// Activation du mode "use client" pour ce composant React
'use client'

// Importation des hooks React pour gérer l'état et les effets secondaires
import { useEffect, useState } from "react"

// Importation de Next.js pour gérer la navigation
import { useParams, useRouter } from "next/navigation";

// Importation des icônes pour le bouton retour et sauvegarde
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";

// Importation des types pour les articles
import { Article } from "@/types/article";

// Importation de SweetAlert2 pour afficher des alertes utilisateur
import Swal from "sweetalert2";

// Composant principal pour la page d'édition de transaction
export default function Page() {
    // Récupération des paramètres d'URL
    const { id } = useParams();

    // Gestionnaire de navigation
    const router = useRouter();

    // États pour gérer les articles et les données du formulaire
    const [articles, setArticles] = useState<Article[]>([]); // Liste des articles disponibles
    const [formData, setFormData] = useState({
        transaction_type: "", // Type de la transaction (ajout/retrait)
        transaction_quantity: 0, // Quantité de l'article pour la transaction
        transaction_date: new Date().toISOString().split("T")[0], // Date de la transaction
        article_name: "", // Nom de l'article
        articleId: "" as number | "", // ID de l'article
        userId: "" as number | "", // ID de l'utilisateur
    });

    // Fonction pour récupérer la liste des articles disponibles
    const fetchArticle = async () => {
        const response = await fetch("/api/article"); // Appel de l'API pour les articles
        if (response.ok) {
            const data = await response.json();
            setArticles(data); // Mise à jour de l'état avec les articles
        } else {
            Swal.fire('Erreur', "Une erreur est survenue lors de l'ajout d'une transaction.", 'error');
        }
    }

    // Fonction pour récupérer les données d'une transaction spécifique
    const fetchTransaction = async () => {
        const response = await fetch(`/api/transaction/${id}`); // Appel de l'API pour la transaction
        if (response.ok) {
            const data = await response.json();
            // Mise à jour du formulaire avec les données de la transaction
            setFormData({
                transaction_type: data.transaction_type,
                transaction_quantity: data.transaction_quantity,
                transaction_date: new Date(data.transaction_date).toISOString().split("T")[0],
                article_name: data.batch.article.article_name,
                articleId: data.batch.articleId,
                userId: data.userId,
            });
        }
    }

    // Effet pour charger les articles et les données de la transaction au montage du composant
    useEffect(() => {
        fetchArticle();
        fetchTransaction();
    }, []);

    // Fonction pour soumettre les données du formulaire
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Empêche le comportement par défaut du formulaire
        formData.userId = 1; // ID utilisateur par défaut

        const response = await fetch(`/api/transaction/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData) // Envoi des données de la transaction
        });

        const data = await response.json();
        if (response.ok) {
            router.push('/transaction'); // Redirection vers la page des transactions
            Swal.fire('', data.message, "success");
        } else {
            Swal.fire('', data.message, 'error');
        }
    };

    // Gestion des changements dans les champs du formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "transaction_quantity" ? parseFloat(value) : value, // Conversion en nombre pour la quantité
        });
    };

    // Rendu du composant principal
    return (
        <div className="h-[calc(100vh-104px)] flex items-center">
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
                <h1 className="text-3xl font-bold mb-3">Éditer une transaction</h1>

                {/* Formulaire pour éditer une transaction */}
                <form onSubmit={handleSubmit}>
                    {/* Champ pour afficher le nom de l'article */}
                    <div className="mb-4">
                        <label className="block">Nom d&apos;article</label>
                        <input type="text" name="transaction_quantity" value={formData.article_name} disabled className="input input-bordered w-full" />
                    </div>

                    {/* Champ pour afficher le type de transaction */}
                    <div className="mb-4">
                        <label className="block">Type de transaction</label>
                        <input type="text" name="transaction_quantity" value={formData.transaction_type} disabled className="input input-bordered w-full" />
                    </div>

                    {/* Champ pour modifier la quantité */}
                    <div className="mb-4">
                        <label className="block">Quantité</label>
                        <input type="number" name="transaction_quantity" value={formData.transaction_quantity} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>

                    {/* Champ pour modifier l'ID utilisateur */}
                    <div className="mb-4">
                        <label className="block">User</label>
                        <input type="number" name="userId" value={formData.userId || 1} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>

                    {/* Champ pour modifier la date de la transaction */}
                    <div className="mb-4">
                        <label className="block">Date de transaction</label>
                        <input type="date" name="transaction_date" value={formData.transaction_date} onChange={handleChange} className="input input-bordered w-full" />
                    </div>

                    {/* Bouton pour sauvegarder les modifications */}
                    <button type="submit" className="flex gap-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 mb-3">
                        <FiSave size={24} /> Sauvegarder
                    </button>
                </form>

            </div>
        </div>
    )
}
