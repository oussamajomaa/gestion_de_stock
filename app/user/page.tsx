'use client'
import { User } from "@/types/user"
import { useState, useEffect } from "react"
import { FaEdit, FaSearch } from "react-icons/fa"
import { IoAdd } from "react-icons/io5"
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import { BiSolidDetail } from "react-icons/bi"
import { MdDelete } from "react-icons/md"
import { CiCircleRemove } from "react-icons/ci";


export default function page() {
	const [users, setUsers] = useState<User[]>([])
	const router = useRouter()
	const fetchUser = async () => {
		try {
			const response = await fetch('/api/user');
			if (response.ok) {
				const data = await response.json();
				setUsers(data);
			} else {
				console.error("Failed to fetch transactions");
			}
		} catch (error) {
			console.error("Error fetching transactions:", error);
		}
	};

	useEffect(() => {
		fetchUser()
	}, [])


	const handleAdd = () => {
		router.push('/user/register')
	}

	const handleEdit = (id: number) => {
		router.push(`/user/${id}/edit`)
	}

	const handleDelete = async (id: number) => {
		// const result = await Swal.fire({
		// 	// title: 'Êtes-vous sûr ?',
		// 	text: `Vous êtes sûr de supprimer la transaction?`,
		// 	icon: 'error',
		// 	showCancelButton: true,
		// 	confirmButtonColor: '#d33',
		// 	cancelButtonColor: '#3085d6',
		// 	confirmButtonText: 'Oui, supprimer !',
		// 	cancelButtonText: 'Annuler'
		// });

		// if (result.isConfirmed) {
		// 	const response = await fetch(`/api/transaction/${id}`, { method: 'DELETE' });
		// 	const data = await response.json()
		// 	if (response.ok) {
		// 		Swal.fire('', data.message, 'success');
		// 	} else {
		// 		Swal.fire('', data.message, 'error');
		// 	}
		// 	fetchUser()
		// }
	}
	if (localStorage.getItem('role') !== 'admin') {
		Swal.fire('', "Vous n'ếtes pas autorisé d....", 'error');
		return
	}

	return (
		<div>
			<div className="flex justify-between items-center mb-3 max-lg:items-start">
				<div className="flex items-center gap-6 w-5/6 max-lg:flex-col max-lg:w-full max-lg:items-start">
					<h1 className="text-2xl font-bold">Liste des Transactions</h1>
				</div>
				<button className="rounded-md p-2 bg-blue-500 hover:bg-blue-600 text-white" onClick={handleAdd}><IoAdd size={24} /></button>
			</div>

			<table className="min-w-full bg-white border border-gray-300">
				<thead>
					<tr>
						<td className="py-2 px-4 border-b font-bold">Email</td>
						<td className="py-2 px-4 border-b font-bold">Rôle</td>
						<td className="py-2 px-4 border-b font-bold">Actions</td>
					</tr>
				</thead>
				<tbody>
					{users.map(user => (
						<tr key={user.id} className="hover:bg-gray-100">
							<td className="py-2 px-4 border-b">{user.email}</td>
							<td className="py-2 px-4 border-b">{user.role}</td>
							<td className="py-2 px-4 border-b flex space-x-2">
								<button onClick={() => handleEdit(user.id)} className="bg-yellow-500 text-white px-2 py-1 rounded"><FaEdit /></button>
								<button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-2 py-1 rounded"><MdDelete /></button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

