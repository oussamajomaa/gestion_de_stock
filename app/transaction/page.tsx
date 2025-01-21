'use client'

import { Transaction } from "@/types/transaction"
import { useState, useEffect } from "react"
import { FaEdit } from "react-icons/fa"
import { IoAdd } from "react-icons/io5"
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import { MdDelete } from "react-icons/md"
import { exportToPDF } from "@/services/toPdf";
import { FaRegFilePdf } from "react-icons/fa6";

export default function Page() {
	const [transactions, setTransactions] = useState<Transaction[]>([])
	const [search, setSearch] = useState('')
	const router = useRouter()

	const toPDF = () => {
		const table = document.getElementById("transaction");
		exportToPDF(table, 'transaction')
	};
	// Fonction pour récupérer les transactions
	const fetchTransactions = async () => {
		try {
			const response = await fetch('/api/transaction');
			if (response.ok) {
				const data = await response.json();
				if (Array.isArray(data)) {
					setTransactions(data);
				} else {
					console.error("Format de réponse inattendu :", data);
					setTransactions([]);
				}
			} else {
				console.error("Échec de la récupération des transactions");
				setTransactions([]);
			}
		} catch (error) {
			console.error("Erreur lors de la récupération des transactions :", error);
			setTransactions([]);
		}
	};

	useEffect(() => {
		fetchTransactions();
	}, []);

	// Gestion de l'ajout
	const handleAdd = () => {
		router.push('/transaction/add');
	};

	// Gestion de l'édition
	const handleEdit = (id: number) => {
		router.push(`/transaction/${id}/edit`);
	};

	// Gestion de la suppression
	const handleDelete = async (id: number) => {
		const result = await Swal.fire({
			text: `Vous êtes sûr de vouloir supprimer cette transaction ?`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Oui, supprimer !',
			cancelButtonText: 'Annuler',
		});

		if (result.isConfirmed) {
			// try {
				const response = await fetch(`/api/transaction/${id}`, { method: 'DELETE' });
				const data = await response.json();

				if (response.ok) {
					Swal.fire('', data.message || 'Transaction supprimée avec succès', 'success');
					fetchTransactions();
				} else {
					Swal.fire('', data.message || 'Échec de la suppression', 'error');
				}
			// } catch (error) {
			// 	Swal.fire('', 'Une erreur est survenue lors de la suppression', 'error');
			// }
		}
	};

	// Réinitialisation de la recherche
	const handleSearchReset = () => {
		setSearch('');
	};

	// Filtrage des transactions
	const filteredTransactions = transactions.filter(transaction =>
		transaction.batch?.article.article_name?.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div>
			<div className="flex justify-between items-center mb-3 max-lg:items-start">
				<div className="flex items-center gap-6 w-5/6 max-lg:flex-col max-lg:w-full max-lg:items-start">
					<h1 className="text-2xl font-bold">Liste des Transactions</h1>
					<div className="flex items-center gap-3">
						<input
							type="text"
							placeholder="Chercher par nom d'article..."
							className="input input-bordered w-full"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							aria-label="Recherche"
						/>
						<button className="btn" onClick={handleSearchReset} aria-label="Réinitialiser la recherche">
							X
						</button>
					</div>
				</div>
				<div className="flex justify-between items-center gap-5">

					<button
						className="rounded-md p-2 bg-blue-500 hover:bg-blue-600 text-white"
						onClick={handleAdd}
						aria-label="Ajouter une transaction"
					>
						<IoAdd size={24} />
					</button>
					<button
						onClick={toPDF}
						className=" p-2 bg-red-500 text-white rounded"
						title="Exporter en pdf"
					>
						<FaRegFilePdf size={24} />
					</button>
				</div>
			</div>

			<table className="min-w-full bg-white border border-gray-300" id="transaction">
				<thead>
					<tr>
						<td className="py-2 px-4 border-b font-bold">Nom d`&apos;article</td>
						<td className="py-2 px-4 border-b font-bold">Type de transaction</td>
						<td className="py-2 px-4 border-b font-bold">Quantité</td>
						<td className="py-2 px-4 border-b font-bold">Date de transaction</td>
						<th className="py-2 px-4 border-b font-bold">Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredTransactions.map(transaction => (
						<tr key={transaction.id} className="hover:bg-gray-100">
							<td className="py-2 px-4 border-b ">{transaction.batch?.article.article_name || 'N/A'}</td>
							<td className="py-2 px-4 border-b ">{transaction.transaction_type}</td>
							<td className="py-2 px-4 border-b ">{transaction.transaction_quantity}</td>
							<td className="py-2 px-4 border-b">{transaction.transaction_date.split('T')[0]}</td>
							<td className="py-2 px-4 border-b flex justify-around">
								<button
									onClick={() => handleEdit(transaction.id)}
									className="bg-yellow-500 text-white px-2 py-1 rounded"
									aria-label="Modifier"
								>
									<FaEdit />
								</button>
								<button
									onClick={() => handleDelete(transaction.id)}
									className="bg-red-500 text-white px-2 py-1 rounded"
									aria-label="Supprimer"
								>
									<MdDelete />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
