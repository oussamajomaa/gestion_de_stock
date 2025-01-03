'use client'
import { Article } from "@/types/article";
import { Batch } from "@/types/batch";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { exportToPDF } from "@/services/toPdf";

import { FaRegFilePdf } from "react-icons/fa6";

// Charger ReactECharts uniquement côté client
const EChartBar = dynamic(() => import('../components/EChartBar'), {
	ssr: false, // Désactiver le rendu côté serveur
});

const EChartPie = dynamic(() => import('../components/EChartPie'), {
	ssr: false, // Désactiver le rendu côté serveur
});

export default function Home() {
	const [articleToBeSupplied, setArticleToBeSupplied] = useState<Article[]>([])
	const [articlesExpired, setArticlesExpired] = useState<Batch[]>([])
	const [articlesExpiringSoon, setArticlesExpiringSoon] = useState<Batch[]>([])
	const [articlesConsumed, setArticlesConsumed] = useState<Article[]>([])
	const fetchData = async () => {
		const response = await fetch('/api')
		const data = await response.json()
		setArticleToBeSupplied(data.articleToBeSupplied)
		setArticlesExpired(data.articlesExpired)
		setArticlesExpiringSoon(data.batchesWithDaysRemaining)
		setArticlesConsumed(data.articlesConsumed)
		console.log(data);
	}

	const xAxisConsumed = articlesConsumed.map(article => article.article_name)
	const seriesConsumed = articlesConsumed.map((article) => ({
		value: article.totalQuantity,
		unit: article.unit, // Inclure l'unité pour chaque article
	}));

	const exportExpired = () => {
		const table = document.getElementById("expired");
		exportToPDF(table, 'articleExpired')
	};

	const exportExpiredSoon = () => {
		const table = document.getElementById("expiredSoon");
		exportToPDF(table, 'articleExpiredSoon')
	};

	const exportToSupply = () => {
		const table = document.getElementById("supply");
		exportToPDF(table, 'articleExpiredSoon')
	};

	useEffect(() => {
		fetchData()
	}, [])
	return (
		<div className="flex flex-col ">
			<h1 className="text-2xl font-bold">Tableau de board</h1>
			<div className="h-[calc(100vh/2-76px)]  grid grid-cols-2  max-lg:grid-cols-1">
				<div className=" p-2 border-b border-r rounded overflow-y-auto">
					<div className="flex justify-between">
						<h2 className="text-xl font-bold mb-2">Lot d'articles périmés</h2>
						<button
							onClick={exportExpired}
							className="mb-4 px-4 py-2 bg-red-500 text-white rounded"
							title="Exporter en pdf"
						>
							<FaRegFilePdf />
						</button>
					</div>
					<table className="min-w-full bg-white  border-gray-300" id="expired">
						<thead>
							<tr className="bg-gray-200">
								<td className="py-2 px-4 border-b font-bold">Nom d'article</td>
								<td className="py-2 px-4 border-b font-bold text-center">Quantité</td>
								<td className="py-2 px-4 border-b font-bold text-center">Date d'expiration</td>
							</tr>
						</thead>
						<tbody>
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
				<div className=" p-2">

					<div className="flex justify-between">
						<h2 className="text-xl font-bold mb-2">Lot d'articles proche de la péremption</h2>
						<button
							onClick={exportExpiredSoon}
							className="mb-4 px-4 py-2 bg-red-500 text-white rounded"
							title="Exporter en pdf"
						>
							<FaRegFilePdf />
						</button>
					</div>
					<table className="min-w-full bg-white  border-gray-300" id="expiredSoon">
						<thead>
							<tr className="bg-gray-200">
								<td className="py-2 px-4 border-b font-bold">Nom d'article</td>
								<td className="py-2 px-4 border-b font-bold text-center">Jours restants</td>
								<td className="py-2 px-4 border-b font-bold text-center">Date d'expiration</td>

							</tr>
						</thead>
						<tbody>
							{articlesExpiringSoon.map(article => (
								<tr key={article.id} className="hover:bg-gray-100">
									<td className="py-2 px-4">{article.article.article_name}</td>
									<td className="py-2 px-4 text-center text-red-500">{article.daysRemaining}</td>
									<td className="py-2 px-4 text-center ">{article.expiration_date.split('T')[0]}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<div className="h-[calc(100vh/2-76px)]  grid grid-cols-2  max-lg:grid-cols-1">
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
					<table className="min-w-full bg-white  border-gray-300" id="supply">
						<thead>
							<tr className="bg-gray-200">
								<td className="py-2 px-4 border-b font-bold">Nom d'article</td>
								<td className="py-2 px-4 border-b font-bold text-center">Quantité disponible</td>
								<td className="py-2 px-4 border-b font-bold text-center">Quantité minimale</td>

							</tr>
						</thead>
						<tbody>
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
				<div className="p-2 border-t border-l ">
					<h2 className="text-xl font-bold mb-2">Articles plus consommés</h2>
					<EChartPie xAxis={xAxisConsumed} series={seriesConsumed} />
				</div>
			</div>
		</div>
	);
}
