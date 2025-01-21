// Activation du mode "use client" pour indiquer que ce composant doit être rendu côté client
'use client'

// Importation des types nécessaires pour les articles et les lots d'articles
import { Article } from "@/types/article";
import { Batch } from "@/types/batch";

// Importation des hooks React pour gérer les états et les effets secondaires
import { useEffect, useState } from "react";

// Importation dynamique du composant EChartPie pour un chargement uniquement côté client
import dynamic from 'next/dynamic';

// Importation du service pour exporter des éléments en PDF et de l'icône pour les boutons d'exportation
import { exportToPDF } from "@/services/toPdf";
import { FaRegFilePdf } from "react-icons/fa6";

// Chargement dynamique du composant EChartPie avec désactivation du rendu côté serveur
const EChartPie = dynamic(() => import('../components/EChartPie'), {
	ssr: false, // Empêche le rendu côté serveur pour ce composant
});

// Déclaration du composant principal de la page
export default function Home() {
	// États pour gérer les données des articles
	const [articleToBeSupplied, setArticleToBeSupplied] = useState<Article[]>([]);
	const [articlesExpired, setArticlesExpired] = useState<Batch[]>([]);
	const [articlesExpiringSoon, setArticlesExpiringSoon] = useState<Batch[]>([]);
	const [articlesConsumed, setArticlesConsumed] = useState<Article[]>([]);

	// Fonction pour récupérer les données depuis une API
	const fetchData = async () => {
		const response = await fetch('/api'); // Appel de l'API
		const data = await response.json(); // Récupération des données en JSON
		// Mise à jour des états avec les données récupérées
		setArticleToBeSupplied(data.articleToBeSupplied);
		setArticlesExpired(data.articlesExpired);
		setArticlesExpiringSoon(data.batchesWithDaysRemaining);
		setArticlesConsumed(data.articlesConsumed);
	};

	// Préparation des données pour le graphique des articles consommés
	const xAxisConsumed = articlesConsumed.map(article => article.article_name);
	const seriesConsumed = articlesConsumed.map((article) => ({
		value: article.totalQuantity, // Quantité totale consommée
		unit: article.unit, // Unité de mesure
	}));

	// Fonction pour exporter le tableau des articles périmés en PDF
	const exportExpired = () => {
		const table = document.getElementById("expired"); // Sélection du tableau par ID
		exportToPDF(table, 'articleExpired'); // Exportation avec un titre spécifique
	};

	// Fonction pour exporter le tableau des articles proches de la péremption en PDF
	const exportExpiredSoon = () => {
		const table = document.getElementById("expiredSoon");
		exportToPDF(table, 'articleExpiredSoon');
	};

	// Fonction pour exporter le tableau des articles à approvisionner en PDF
	const exportToSupply = () => {
		const table = document.getElementById("supply");
		exportToPDF(table, 'articleToSupply');
	};

	// Effet pour récupérer les données lors du premier rendu du composant
	useEffect(() => {
		fetchData();
	}, []); // Tableau de dépendances vide pour exécuter une seule fois

	// Rendu du composant
	return (
		<div className="flex flex-col">
			{/* Titre principal */}
			<h1 className="text-2xl font-bold">Tableau de board</h1>

			{/* Section pour les tableaux des articles périmés et proches de la péremption */}
			<div className="h-[calc(100vh/2-76px)] grid grid-cols-2 max-lg:grid-cols-1">

				{/* Tableau des articles périmés */}
				<div className="p-2 border-b border-r rounded overflow-y-auto">
					<div className="flex justify-between">
						<h2 className="text-xl font-bold mb-2">Lot d&apos;articles périmés</h2>
						<button
							onClick={exportExpired}
							className="mb-4 px-4 py-2 bg-red-500 text-white rounded"
							title="Exporter en pdf"
						>
							<FaRegFilePdf />
						</button>
					</div>
					<table className="min-w-full bg-white border-gray-300" id="expired">
						<thead>
							<tr className="bg-gray-200">
								<td className="py-2 px-4 border-b font-bold">Nom d&apos;article</td>
								<td className="py-2 px-4 border-b font-bold text-center">Quantité</td>
								<td className="py-2 px-4 border-b font-bold text-center">Date d&apos;expiration</td>
							</tr>
						</thead>
						<tbody>
							{/* Affichage des articles périmés */}
							{articlesExpired.map(article => (
								<tr key={article.id} className="hover:bg-gray-100">
									<td className="py-2 px-4">{article.article.article_name}</td>
									<td className="py-2 px-4 text-center">{article.quantity}</td>
									<td className="py-2 px-4 text-center text-red-500">{article.expiration_date.split('T')[0]}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Tableau des articles proches de la péremption */}
				<div className="p-2">
					<div className="flex justify-between">
						<h2 className="text-xl font-bold mb-2">Lot d&apos;articles proche de la péremption</h2>
						<button
							onClick={exportExpiredSoon}
							className="mb-4 px-4 py-2 bg-red-500 text-white rounded"
							title="Exporter en pdf"
						>
							<FaRegFilePdf />
						</button>
					</div>
					<table className="min-w-full bg-white border-gray-300" id="expiredSoon">
						<thead>
							<tr className="bg-gray-200">
								<td className="py-2 px-4 border-b font-bold">Nom d&apos;article</td>
								<td className="py-2 px-4 border-b font-bold text-center">Jours restants</td>
								<td className="py-2 px-4 border-b font-bold text-center">Date d&apos;expiration</td>
							</tr>
						</thead>
						<tbody>
							{/* Affichage des articles proches de la péremption */}
							{articlesExpiringSoon.map(article => (
								<tr key={article.id} className="hover:bg-gray-100">
									<td className="py-2 px-4">{article.article.article_name}</td>
									<td className="py-2 px-4 text-center text-red-500">{article.daysRemaining}</td>
									<td className="py-2 px-4 text-center">{article.expiration_date.split('T')[0]}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Section pour les articles à approvisionner et les graphiques */}
			<div className="h-[calc(100vh/2-76px)] grid grid-cols-2 max-lg:grid-cols-1">

				{/* Tableau des articles à approvisionner */}
				<div className="p-2">
					<div className="flex justify-between">
						<h2 className="text-xl font-bold mb-2">Articles à approvisionner</h2>
						<button
							onClick={exportToSupply}
							className="mb-4 px-4 py-2 bg-red-500 text-white rounded"
							title="Exporter en pdf"
						>
							<FaRegFilePdf />
						</button>
					</div>
					<table className="min-w-full bg-white border-gray-300" id="supply">
						<thead>
							<tr className="bg-gray-200">
								<td className="py-2 px-4 border-b font-bold">Nom d&apos;article</td>
								<td className="py-2 px-4 border-b font-bold text-center">Quantité disponible</td>
								<td className="py-2 px-4 border-b font-bold text-center">Quantité minimale</td>
							</tr>
						</thead>
						<tbody>
							{/* Affichage des articles à approvisionner */}
							{articleToBeSupplied.map(article => (
								<tr key={article.id} className="hover:bg-gray-100">
									<td className="py-2 px-4">{article.article_name}</td>
									<td className="py-2 px-4 text-center text-red-500">{article.totalQuantity}</td>
									<td className="py-2 px-4 text-center">{article.quantity_min}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Graphique des articles consommés */}
				<div className="p-2 border-t border-l">
					<h2 className="text-xl font-bold mb-2">Articles plus consommés</h2>
					<EChartPie xAxis={xAxisConsumed} series={seriesConsumed} />
				</div>
			</div>
		</div>
	);
}
