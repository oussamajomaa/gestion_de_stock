'use client'
import { User } from "@/types/user";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import { MdDelete } from "react-icons/md";

export default function Page() {
	// **État pour stocker les utilisateurs récupérés depuis l'API**
	const [users, setUsers] = useState<User[]>([]);

	// **Initialise le routeur pour naviguer entre les pages**
	const router = useRouter();

	// **Fonction pour récupérer les utilisateurs via une requête API**
	const fetchUser = async () => {
		try {
			const token = localStorage.getItem('token');
	
			if (!token) {
				throw new Error("Token not found");
			}
	
			const response = await fetch('/api/user', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`, // Ajouter le token
					'Content-Type': 'application/json',
				},
			});
	
			if (response.ok) {
				const data = await response.json();
				setUsers(data);
			} else {
				console.error("Failed to fetch users:", await response.json());
			}
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};
	
	

	// **Récupère les utilisateurs lors du montage du composant**
	useEffect(() => {
		fetchUser();
	}, []);

	// **Fonction pour naviguer vers la page d'ajout d'utilisateur**
	const handleAdd = () => {
		router.push('/user/add');
	};

	// **Fonction pour naviguer vers la page d'édition d'un utilisateur**
	const handleEdit = (id: number) => {
		router.push(`/user/${id}`);
	};

	// **Fonction pour supprimer un utilisateur après confirmation**
	const handleDelete = async (id: number) => {
		// Demande de confirmation avant suppression
		const result = await Swal.fire({
			text: `Vous êtes sûr de supprimer cet utilisateur?`,
			icon: 'error',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Oui, supprimer !',
			cancelButtonText: 'Annuler'
		});

		if (result.isConfirmed) {
			// Requête API pour supprimer l'utilisateur
			const response = await fetch(`/api/user/${id}`, { method: 'DELETE' });
			const data = await response.json();
			if (response.ok) {
				// Affiche un message de succès
				Swal.fire('', data.message, 'success');
			} else {
				// Affiche un message d'erreur si la suppression échoue
				Swal.fire('', data.message, 'error');
			}
			// Rafraîchit la liste des utilisateurs après suppression
			fetchUser();
		}
	};

	// **Vérifie si l'utilisateur connecté est un administrateur**
	if (localStorage.getItem('role') !== 'admin') {
		Swal.fire('', "Vous n'êtes pas autorisé à accéder à cette page.", 'error');
		return null; // Interrompt le rendu si non autorisé
	}

	// **Rendu de la page**
	return (
		<div>
			{/* En-tête avec un bouton pour ajouter un utilisateur */}
			<div className="flex justify-between items-center mb-3 max-lg:items-start">
				<div className="flex items-center gap-6 w-5/6 max-lg:flex-col max-lg:w-full max-lg:items-start">
					<h1 className="text-2xl font-bold">Liste des Transactions</h1>
				</div>
				{/* Bouton pour ajouter un utilisateur */}
				<button
					className="rounded-md p-2 bg-blue-500 hover:bg-blue-600 text-white"
					onClick={handleAdd}
					aria-label="Add user"
				>
					<IoAdd size={24} />
				</button>
			</div>

			{/* Tableau pour afficher les utilisateurs */}
			<table className="min-w-full bg-white border-gray-300">
				<thead>
					<tr>
						<td className="py-2 px-4 border-b font-bold">Email</td>
						<td className="py-2 px-4 border-b font-bold">Rôle</td>
						<td className="py-2 px-4 border-b font-bold">Actions</td>
					</tr>
				</thead>
				<tbody>
					{/* Boucle pour afficher chaque utilisateur */}
					{users.map(user => (
						<tr key={user.id} className="hover:bg-gray-100">
							{/* Ne pas afficher les actions pour l'utilisateur actuellement connecté */}
							{localStorage.getItem('email') !== user.email && (
								<>
									<td className="py-2 px-4 border-b">{user.email}</td>
									<td className="py-2 px-4 border-b">{user.role}</td>
									<td className="py-2 px-4 border-b flex space-x-2">
										{/* Bouton pour éditer l'utilisateur */}
										<button
											onClick={() => handleEdit(user.id)}
											className="bg-yellow-500 text-white px-2 py-1 rounded"
											aria-label={`Edit ${user.email}`}
										>
											<FaEdit />
										</button>
										{/* Bouton pour supprimer l'utilisateur */}
										<button
											onClick={() => handleDelete(user.id)}
											className="bg-red-500 text-white px-2 py-1 rounded"
											aria-label={`Delete ${user.email}`}
										>
											<MdDelete />
										</button>
									</td>
								</>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
