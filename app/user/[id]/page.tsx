'use client';
import { useRouter, useParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function Register() {
	// État pour stocker le rôle sélectionné
	const [role, setRole] = useState('');
	// État pour afficher ou cacher le spinner de chargement
	const [isLoading, setIsLoading] = useState(false);
	// État pour stocker les données du formulaire (email et rôle de l'utilisateur)
	const [formData, setFormData] = useState({
		email: '',
		role: '',
	});
	const router = useRouter(); // Permet de naviguer vers d'autres pages
	const { id } = useParams(); // Récupère l'ID de l'utilisateur depuis l'URL

	// Fonction pour récupérer les données de l'utilisateur à éditer
	const fetchUser = async () => {
		setIsLoading(true); // Affiche le spinner pendant le chargement
		try {
			const response = await fetch(`/api/user/${id}`); // Requête API pour récupérer les données utilisateur
			if (response.ok) {
				const data = await response.json(); // Récupère les données JSON
				setFormData({
					email: data.email,
					role: data.role,
				});
				setRole(data.role); // Initialise le rôle avec les données récupérées
			} else {
				// Affiche une alerte si la requête échoue
				Swal.fire('Erreur', "Impossible de récupérer les données de l'utilisateur.", 'error');
			}
		} catch (error) {
			// Gère les erreurs réseau
			console.error('Network error:', error);
			Swal.fire('Erreur', 'Erreur réseau.', 'error');
		} finally {
			setIsLoading(false); // Masque le spinner une fois la requête terminée
		}
	};

	// useEffect pour charger les données utilisateur lors du montage du composant
	useEffect(() => {
		fetchUser();
	}, []);

	// Fonction pour mettre à jour les données utilisateur
	const handleUpdateUser = async (e: FormEvent) => {
		e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
		try {
			// Requête API pour mettre à jour l'utilisateur
			const response = await fetch(`/api/user/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ role }), // Envoie uniquement le rôle mis à jour
			});

			const data = await response.json(); // Récupère la réponse JSON
			if (response.ok) {
				// Si la mise à jour est réussie, affiche un message de succès
				Swal.fire('', data.message, 'success');
				router.push('/user'); // Redirige vers la liste des utilisateurs
			} else {
				// Affiche un message d'erreur si la mise à jour échoue
				Swal.fire('', data.message || 'Une erreur est survenue.', 'error');
			}
		} catch (error) {
			// Gère les erreurs réseau
			console.error('Network error:', error);
			Swal.fire('', 'Erreur réseau.', 'error');
		}
	};

	// useEffect pour restreindre l'accès à la page si l'utilisateur n'est pas administrateur
	useEffect(() => {
		if (localStorage.getItem('role') !== 'admin') {
			Swal.fire('', "Vous n'êtes pas autorisé à accéder à cette page.", 'error').then(() => {
				router.push('/'); // Redirige vers la page d'accueil si non autorisé
			});
		}
	}, []);

	// Rendu du formulaire
	return (
		<div className=" ">
			{/* Spinner de chargement */}
			{isLoading && (
				<span className="loading loading-bars loading-lg text-accent block m-auto"></span>
			)}
			<div className="p-5 shadow-2xl w-[500px] m-auto rounded-md">
				<div className="flex flex-col gap-5 justify-center items-center">
					<h2 className="text-2xl font-bold">Éditer un utilisateur</h2>
					<form onSubmit={handleUpdateUser} className="flex flex-col gap-5 w-[400px]">
						{/* Champ email (lecture seule) */}
						<input
							className="input input-bordered input-primary w-full"
							type="email"
							readOnly
							value={formData.email} // Affiche l'email de l'utilisateur
							placeholder="E-mail"
						/>

						{/* Sélecteur de rôle */}
						<select
							className="select select-bordered select-primary w-full"
							value={role} // Liaison au rôle sélectionné
							onChange={(e) => setRole(e.target.value)} // Met à jour l'état du rôle
						>
							<option value="" disabled>
								Choisir un rôle
							</option>
							<option value="admin">Administrateur</option>
							<option value="user">Utilisateur</option>
						</select>

						{/* Bouton de soumission */}
						<button type="submit" className="btn btn-primary">
							Valider
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
