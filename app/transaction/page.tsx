'use client'

import { Transaction } from "@/types/transaction"
import { useState, useEffect } from "react"
import { FaEdit, FaSearch } from "react-icons/fa"
import { IoAdd } from "react-icons/io5"
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import { BiSolidDetail } from "react-icons/bi"
import { MdDelete } from "react-icons/md"
import { CiCircleRemove } from "react-icons/ci";


export default function page() {
	const [transactions, setTransactions] = useState<Transaction[]>([])
	const [search, setSearch] = useState('')
	const router = useRouter()
	const fetchTransaction = async () => {
		try {
			const response = await fetch('/api/transaction');
			if (response.ok) {
				const data = await response.json();
				if (Array.isArray(data)) {
					setTransactions(data);
					console.log(data)
				} else {
					console.error("Unexpected response format:", data);
					setTransactions([]);
				}
			} else {
				console.error("Failed to fetch transactions");
				setTransactions([]);
			}
		} catch (error) {
			console.error("Error fetching transactions:", error);
			setTransactions([]);
		}
	};

	useEffect(() => {
		fetchTransaction()
	}, [])

	const handleSubmit = () => {}

	const handleAdd = () => {
		router.push('/transaction/add')
	}

	const handleEdit = (id:number) => {
		router.push(`/transaction/${id}/edit`)
	}

	const handleDelete = async(id:number) => {
		const result = await Swal.fire({
			// title: 'Êtes-vous sûr ?',
			text: `Vous êtes sûr de supprimer la transaction?`,
			icon: 'error',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Oui, supprimer !',
			cancelButtonText: 'Annuler'
		});

		if (result.isConfirmed) {
			const response = await fetch(`/api/transaction/${id}`, { method: 'DELETE' });
			const data = await response.json()
			if (response.ok) {
				Swal.fire('', data.message, 'success');
			} else {
				Swal.fire('', data.message, 'error');
			}
			fetchTransaction()
		}
	}
	const handlSearch = () => {
		setSearch('')
	}
	// Filtrage des articles en fonction du terme de recherche
	const filteredTransactions = transactions.filter(transaction =>
		transaction.batch?.article.article_name.toLowerCase().includes(search.toLowerCase())
	);


	return (
		<div>
			<div className="flex justify-between items-center mb-3 max-lg:items-start">
				<div className="flex items-center gap-6 w-5/6 max-lg:flex-col max-lg:w-full max-lg:items-start">
					<h1 className="text-2xl font-bold">Liste des Transactions</h1>
					<div className=" flex items-center gap-3">
						<input type="text" placeholder="chercher par nom d'artcile..." className="input input-bordered w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
						<button className="btn" onClick={handlSearch}>X</button>
					</div>
				</div>
				<button className="rounded-md p-2 bg-blue-500 hover:bg-blue-600 text-white" onClick={handleAdd}><IoAdd size={24} /></button>
			</div>

			<table className="min-w-full bg-white border border-gray-300">
				<thead>
					<tr>
						<td className="py-2 px-4 border-b font-bold">Nom d'article</td>
						<td className="py-2 px-4 border-b font-bold">Type de transaction</td>
						<td className="py-2 px-4 border-b font-bold">Quantité</td>
						<td className="py-2 px-4 border-b font-bold">Date de transaction</td>
						<td className="py-2 px-4 border-b font-bold">Actions</td>
					</tr>
				</thead>
				<tbody>
					{filteredTransactions.map(transaction => (
						<tr key={transaction.id} className="hover:bg-gray-100">
							<td className="py-2 px-4 border-b">{transaction.batch?.article.article_name ? transaction.batch?.article.article_name : null}</td>
							<td className="py-2 px-4 border-b">{transaction.transaction_type}</td>
							<td className="py-2 px-4 border-b">{transaction.transaction_quantity}</td>
							<td className="py-2 px-4 border-b">{transaction.transaction_date.split('T')[0]}</td>
							<td className="py-2 px-4 border-b flex space-x-2">
								<button onClick={() => handleEdit(transaction.id)} className="bg-yellow-500 text-white px-2 py-1 rounded"><FaEdit /></button>
								<button onClick={() => handleDelete(transaction.id)} className="bg-red-500 text-white px-2 py-1 rounded"><MdDelete /></button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
