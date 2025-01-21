'use client'

// Importation des types, hooks React et bibliothèques nécessaires
import { Batch } from "@/types/batch" // TypeScript : Définition du type Batch
import { useEffect, useState } from "react" // Hooks pour la gestion de l'état et des effets
import { MdDelete } from "react-icons/md" // Icône de suppression
import Swal from 'sweetalert2'; // Bibliothèque pour les popups/alertes

export default function Page() {
	// Déclare un état local pour stocker la liste des articles périmés
	const [articlesExpired, setArticlesExpired] = useState<Batch[]>([])

	// Fonction pour récupérer les articles périmés depuis l'API
	const fetchArticle = async () => {
		// Envoi d'une requête GET à l'endpoint `/api/peremption`
		const response = await fetch('/api/peremption')
		const data = await response.json() // Conversion de la réponse en JSON

		// Mise à jour de l'état local avec les données reçues
		setArticlesExpired(data.articlesExpired)
	}

	// `useEffect` s'exécute une fois lors du montage du composant
	// Il déclenche la récupération des articles périmés
	useEffect(() => {
		fetchArticle()
	}, [])

	// Fonction pour gérer la suppression d'un article périmé
	const handleDelete = async (id: number) => {
		// Affiche une boîte de dialogue de confirmation
		const result = await Swal.fire({
			text: `Vous êtes sûr de supprimer cet article?`,
			icon: 'error', // Icône d'erreur pour la suppression
			showCancelButton: true, // Affiche le bouton "Annuler"
			confirmButtonColor: '#d33', // Couleur du bouton "Confirmer"
			cancelButtonColor: '#3085d6', // Couleur du bouton "Annuler"
			confirmButtonText: 'Oui, supprimer !', // Texte du bouton "Confirmer"
			cancelButtonText: 'Annuler' // Texte du bouton "Annuler"
		});

		// Si l'utilisateur confirme la suppression
		if (result.isConfirmed) {
			// Envoi d'une requête DELETE à l'API avec l'ID de l'article
			const response = await fetch(`/api/peremption/${id}`, { method: 'DELETE' });
			const data = await response.json(); // Récupère le message de l'API

			// Affiche une notification de succès ou d'erreur en fonction de la réponse
			if (response.ok) {
				Swal.fire('', data.message, 'success'); // Message de succès
			} else {
				Swal.fire('', data.message, 'error'); // Message d'erreur
			}

			// Recharge la liste des articles périmés après la suppression
			fetchArticle();
		}
	}

	// Rendu du composant
	return (
		<div className="flex gap-3 max-lg:flex-col">
			{/* Section principale contenant la liste des articles périmés */}
			<div className="w-full">
				<h2 className="text-2xl font-bold">Articles périmés</h2>
				
				{/* Tableau pour afficher les articles périmés */}
				<table className="min-w-full">
					<thead>
						<tr>
							{/* En-têtes des colonnes */}
							<td className="py-2 px-4 border-b font-bold">Nom</td>
							<td className="py-2 px-4 border-b font-bold">Quantité</td>
							<td className="py-2 px-4 border-b font-bold">Date d&apos;expiration</td>
							<td className="py-2 px-4 border-b font-bold">Actions</td>
						</tr>
					</thead>
					<tbody>
						{/* Parcours de la liste des articles périmés pour afficher chaque article */}
						{articlesExpired.map(article => (
							<tr key={article.id} className="hover:bg-gray-100">
								{/* Nom de l'article */}
								<td className="py-2 px-4 border-b">{article.article?.article_name}</td>
								{/* Quantité disponible */}
								<td className="py-2 px-4 border-b">{article.quantity}</td>
								{/* Date d'expiration formatée en fonction de la locale */}
								<td className="py-2 px-4 border-b">{new Date(article.expiration_date).toLocaleDateString()}</td>
								{/* Bouton pour supprimer l'article */}
								<td className="py-2 px-4 border-b flex space-x-2">
									<button
										onClick={() => handleDelete(article.id)} // Appelle `handleDelete` avec l'ID de l'article
										className="bg-red-500 text-white px-2 py-1 rounded"
									>
										<MdDelete /> {/* Icône de suppression */}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
