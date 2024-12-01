'use client'

import { Article } from "@/types/article"
import { Batch } from "@/types/batch"
import { useEffect, useState } from "react"
import { BiSolidDetail } from "react-icons/bi"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import Swal from 'sweetalert2';

export default function page() {
	const [articlesExpiringSoon,setArticlesExpiringSoon] = useState<Batch[]>([])
	const [articlesExpired,setArticlesExpired] = useState<Batch[]>([])
	const fetchArticle = async() => {
		const response = await fetch('/api/peremption')
		const data = await response.json()
		setArticlesExpiringSoon(data.articlesExpiringSoon)
		setArticlesExpired(data.articlesExpired)
		
		// setArticleExpired(data.articleExpired)
	}

	useEffect(()=>{
		fetchArticle()
	},[])

	const handleDelete = async (id:number) => {
		const result = await Swal.fire({
			// title: 'Êtes-vous sûr ?',
			text: `Vous êtes sûr de supprimer cet article?`,
			icon: 'error',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Oui, supprimer !',
			cancelButtonText: 'Annuler'
		});

		if (result.isConfirmed) {
			const response = await fetch(`/api/peremption/${id}`, { method: 'DELETE' });
			const data = await response.json()
			if (response.ok) {
				Swal.fire('', data.message, 'success');
			} else {
				Swal.fire('', data.message, 'error');
			}
			fetchArticle()
		}
	}

	return (
		<div className="flex gap-3  max-lg:flex-col">
			{/* <div className="w-full">
				
				<h2 className="text-2xl font-bold">Artciles périmés dans moins de 10 jours</h2>
				<table className="min-w-full ">
					<thead>
						<tr>
							<td className="py-2 px-4 border-b font-bold">Nom</td>
							<td className="py-2 px-4 border-b font-bold">Quantité</td>
							<td className="py-2 px-4 border-b font-bold">Date d'expiration</td>
							<td className="py-2 px-4 border-b font-bold">Actions</td>
						</tr>
					</thead>
					<tbody>
						{articlesExpiringSoon.map(article => (
							<tr key={article.id} className="hover:bg-gray-100">
								<td className="py-2 px-4 border-b">{article.article?.article_name}</td>
								<td className="py-2 px-4 border-b">{article.quantity}</td>
								<td className="py-2 px-4 border-b">{new Date(article.expiration_date).toLocaleDateString()}</td>
								<td className="py-2 px-4 border-b flex space-x-2">
									<button onClick={() => handleEdit(article.id)} className="bg-yellow-500 text-white px-2 py-1 rounded"><FaEdit /></button>
									<button onClick={() => handleDelete(article.id)} className="bg-red-500 text-white px-2 py-1 rounded"><MdDelete /></button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div> */}
			<div className="w-full ">
			<h2 className="text-2xl font-bold">Artciles périmés</h2>
				<table className="min-w-full ">
					<thead>
						<tr>
							<td className="py-2 px-4 border-b font-bold">Nom</td>
							<td className="py-2 px-4 border-b font-bold">Quantité</td>
							<td className="py-2 px-4 border-b font-bold">Date d'expiration</td>
							<td className="py-2 px-4 border-b font-bold">Actions</td>
						</tr>
					</thead>
					<tbody>
						{articlesExpired.map(article => (
							<tr key={article.id} className="hover:bg-gray-100">
								<td className="py-2 px-4 border-b">{article.article?.article_name}</td>
								<td className="py-2 px-4 border-b">{article.quantity}</td>
								<td className="py-2 px-4 border-b">{new Date(article.expiration_date).toLocaleDateString()}</td>
								<td className="py-2 px-4 border-b flex space-x-2">
									{/* <button onClick={() => handleEdit(article.id)} className="bg-yellow-500 text-white px-2 py-1 rounded"><FaEdit /></button> */}
									<button onClick={() => handleDelete(article.id)} className="bg-red-500 text-white px-2 py-1 rounded"><MdDelete /></button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			
		</div>
	)
}