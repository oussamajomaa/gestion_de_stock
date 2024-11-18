'use client'

import { useEffect, useState } from "react"
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiSolidDetail } from "react-icons/bi";
import { Article } from "@/types/article";
import { IoAdd } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import { FaSearch } from "react-icons/fa";


export default function page() {
	const [articles, setArticles] = useState<Article[]>([])
	const [search,setSearch] = useState('')
	const router = useRouter()
	const fetchArticles = async () => {
		const response = await fetch('api/article')

		if (response.ok) {
			const data = await response.json()
			setArticles(data)
			console.log(data)
		}
	}

	useEffect(() => {
		fetchArticles()
	}, [])

	const handleDelete = async (id: number, article_name: string) => {
		const result = await Swal.fire({
			// title: 'Êtes-vous sûr ?',
			html: `Vous êtes sûr de supprimer l'article <span style="color: red;">${article_name}</span> ?`,
			icon: 'error',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Oui, supprimer !',
			cancelButtonText: 'Annuler'
		});

		if (result.isConfirmed) {
			const response = await fetch(`/api/article/${id}`, { method: 'DELETE' });

			if (response.ok) {
				setArticles(articles.filter(article => article.id !== id));
				Swal.fire('Supprimé!', "L'article a été supprimé avec succès.", 'success');
			} else {
				Swal.fire('Erreur', "Une erreur est survenue lors de la suppression de l'article.", 'error');
			}
		}
	};

	const handleEdit = (id: number) => {
		// Redirige vers la page d'édition ou ouvre un modal
		console.log(`Edit article with id ${id}`)
		router.push(`/article/${id}/edit`)
	}

	const handleDetail = (id: number) => {
		// Redirige vers la page de détails ou ouvre un modal
		router.push(`/article/${id}/show`)
	}

	// Fonction pour gérer la navigation vers la route "add"
	const handleAdd = () => {
		router.push("/article/add");
	};

	// // Empêche la soumission par défaut et appelle `updateArticle`
    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     console.log(search);
    // };

	const handlSearch = () => {
		setSearch('')
	}
	// Filtrage des articles en fonction du terme de recherche
	const filteredArticles = articles.filter(article =>
		article.article_name.toLowerCase().includes(search.toLowerCase())
	);

	const handleFixture = async() => {
		const response = await fetch('/api/fixture')
		const data = await response.json()
		console.log(data)
	}

	return (
		<div className="">
			<div className="flex justify-between items-center mb-3 max-lg:items-start">
				<div className="flex items-center gap-6 w-5/6 max-lg:flex-col max-lg:w-full max-lg:items-start">
					<h1 className="text-2xl font-bold">Liste des Articles</h1>
					<div className=" flex items-center gap-3">
						<input type="text" placeholder="chercher par nom d'artcile..." className="input input-bordered w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
						<button className="btn" onClick={handlSearch}>X</button>
					</div>
				</div>
				<button className="rounded-md p-2 bg-blue-500 hover:bg-blue-600 text-white" onClick={handleAdd}><IoAdd size={24} /></button>
			</div>
			{/* <button onClick={handleFixture} className="btn btn-primary my-3">Fixture</button> */}
			<table className="min-w-full bg-white border border-gray-300">
				<thead>
					<tr>
						<td className="py-2 px-4 border-b font-bold">Nom</td>
						<td className="py-2 px-4 border-b font-bold">Quantité</td>
						<td className="py-2 px-4 border-b font-bold">Code-barres</td>
						<td className="py-2 px-4 border-b font-bold">Quantité min</td>
						<td className="py-2 px-4 border-b font-bold">Unité</td>
						<td className="py-2 px-4 border-b font-bold">Prix unitaire</td>
						<td className="py-2 px-4 border-b font-bold">Catégorie</td>
						<td className="py-2 px-4 border-b font-bold">Actions</td>
					</tr>
				</thead>
				<tbody>
					{filteredArticles.map(article => (
						<tr key={article.id} className="hover:bg-gray-100">
							<td className="py-2 px-4 border-b">{article.article_name}</td>
							<td className="py-2 px-4 border-b">{article.current_quantity}</td>
							<td className="py-2 px-4 border-b">{article.barcode}</td>
							<td className="py-2 px-4 border-b">{article.quantity_min}</td>
							<td className="py-2 px-4 border-b">{article.unit}</td>
							<td className="py-2 px-4 border-b">{article.unit_price}</td>
							<td className="py-2 px-4 border-b">{article.category ? article.category.category_name : 'null'}</td>
							<td className="py-2 px-4 border-b flex space-x-2">
								<button onClick={() => handleDetail(article.id)} className="bg-gray-500 text-white px-2 py-1 rounded"><BiSolidDetail /></button>
								<button onClick={() => handleEdit(article.id)} className="bg-yellow-500 text-white px-2 py-1 rounded"><FaEdit /></button>
								<button onClick={() => handleDelete(article.id, article.article_name)} className="bg-red-500 text-white px-2 py-1 rounded"><MdDelete /></button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
