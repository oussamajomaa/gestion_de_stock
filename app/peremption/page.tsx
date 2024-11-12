'use client'

import { Article } from "@/types/article"
import { useEffect, useState } from "react"
import { BiSolidDetail } from "react-icons/bi"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"

export default function page() {
	const [articles,setArticles] = useState<Article[]>([])
	const [articleExpired,setArticleExpired] = useState<Article[]>([])
	const fetchArticle = async() => {
		const response = await fetch('/api/peremption')
		const data = await response.json()
		setArticles(data.articles)
		setArticleExpired(data.articleExpired)
	}

	useEffect(()=>{
		fetchArticle()
	},[])

	const handleDetail = (id:number) => {

	}

	const handleDelete = (id:number) => {
		
	}

	const handleEdit = (id:number) => {
		
	}
	return (
		<div className="flex gap-3  max-lg:flex-col">
			<div className="w-full">
				<h2 className="text-2xl font-bold">Artciles périmés</h2>
				<table className="min-w-full shadow-xl">
					<thead>
						<tr>
							<td className="py-2 px-4 border-b font-bold">Nom</td>
							<td className="py-2 px-4 border-b font-bold">Quantité</td>
							<td className="py-2 px-4 border-b font-bold">Date d'expiration</td>
							<td className="py-2 px-4 border-b font-bold">Actions</td>
						</tr>
					</thead>
					<tbody>
						{articles.map(article => (
							<tr key={article.id} className="hover:bg-gray-100">
								<td className="py-2 px-4 border-b">{article.article_name}</td>
								<td className="py-2 px-4 border-b">{article.article_quantity}</td>
								<td className="py-2 px-4 border-b">{new Date(article.expiration_date).toLocaleDateString()}</td>
								<td className="py-2 px-4 border-b flex space-x-2">
									<button onClick={() => handleEdit(article.id)} className="bg-yellow-500 text-white px-2 py-1 rounded"><FaEdit /></button>
									<button onClick={() => handleDelete(article.id)} className="bg-red-500 text-white px-2 py-1 rounded"><MdDelete /></button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="w-full ">
				<h2 className="text-2xl font-bold">Artciles périmés dans moins de 10 jours</h2>
				<table className="min-w-full shadow-xl">
					<thead>
						<tr>
							<td className="py-2 px-4 border-b font-bold">Nom</td>
							<td className="py-2 px-4 border-b font-bold">Quantité</td>
							<td className="py-2 px-4 border-b font-bold">Date d'expiration</td>
							<td className="py-2 px-4 border-b font-bold">Actions</td>
						</tr>
					</thead>
					<tbody>
						{articleExpired.map(article => (
							<tr key={article.id} className="hover:bg-gray-100">
								<td className="py-2 px-4 border-b">{article.article_name}</td>
								<td className="py-2 px-4 border-b">{article.article_quantity}</td>
								<td className="py-2 px-4 border-b">{new Date(article.expiration_date).toLocaleDateString()}</td>
								<td className="py-2 px-4 border-b flex space-x-2">
									<button onClick={() => handleEdit(article.id)} className="bg-yellow-500 text-white px-2 py-1 rounded"><FaEdit /></button>
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