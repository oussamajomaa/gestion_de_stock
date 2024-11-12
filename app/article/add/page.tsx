

'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import ArticleForm from "@/components/ArticleForm";
import { Category } from "@/types/category";
import { FiSave } from "react-icons/fi";
import Swal from "sweetalert2";


export default function page() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [formData, setFormData] = useState({
		article_name: "",
		article_description: "",
		article_quantity: 0,
		barcode: "",
		expiration_date: new Date().toISOString().split("T")[0],
		quantity_min: 0,
		unit: "",
		unit_price: 0,
		categoryId: "" as number | ""
	});
	const router = useRouter();
	const fetchCategories = async () => {
		const response = await fetch("/api/category"); // Remplacez par votre endpoint
		if (response.ok) {
			const data = await response.json();
			setCategories(data);
			console.log(data);

		}
	};
	useEffect(() => {
		// Récupérer les catégories depuis l'API ou une source de données
		fetchCategories();
	}, []);


	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const response = await fetch("/api/article", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});

		if (response.ok) {
			router.push("/article");
			Swal.fire({
				html: `L'article <span style="color: red;">${formData.article_name}</span> a été ajouté avec succès !`,
				icon: "success",

			});
		} else {
			Swal.fire('Erreur', "Une erreur est survenue lors de l'ajout d'un article.", 'error');
		}
	};

	return (
		<div className="h-[calc(100vh-104px)] flex items-center">
			<div className="w-1/2 m-auto max-xl:w-full shadow-2xl rounded-2xl p-10">
				<button
					onClick={() => router.back()}
					className="flex items-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 mb-3"
				>
					<IoIosArrowBack size={24} />
					Retour
				</button>
				<h1 className="text-3xl font-bold mb-3">Ajouter un article</h1>

				{/* <ArticleForm handleSubmit={handleSubmit} handleChange={handleChange} formData={formData} categories={categories}/> */}
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block">Nom de l'article</label>
						<input type="text" name="article_name" value={formData.article_name} onChange={handleChange} className="input input-bordered w-full" required />
					</div>
					<div className="mb-4">
						<label className="block">Description</label>
						<textarea name="article_description" value={formData.article_description} onChange={handleChange} className="textarea textarea-bordered w-full" />
					</div>

					{/* Sélecteur de Catégorie */}
					<div className="mb-4">
						<label className="block">Catégorie</label>
						<select name="categoryId" value={formData.categoryId || ""} onChange={handleChange} className="select select-bordered w-full" required>
							<option value="">Sélectionnez une catégorie</option>
							{categories.map(category => (
								<option key={category.id} value={category.id}>
									{category.category_name}
								</option>
							))}
						</select>
					</div>

					<div className="grid grid-cols-2 gap-2 ">
						<div className="mb-4">
							<label className="block">Quantité minimale</label>
							<input type="number" name="quantity_min" value={formData.quantity_min} onChange={handleChange} className="input input-bordered w-full" required />
						</div>
						<div>
							<div className="mb-4">
								<label className="block">Quantité</label>
								<input type="number" name="article_quantity" value={formData.article_quantity} onChange={handleChange} className="input input-bordered w-full" required />
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2 ">
						<div className="mb-4">
							<label className="block">Code-barres</label>
							<input type="text" name="barcode" value={formData.barcode} onChange={handleChange} className="input input-bordered w-full" required />
						</div>
						<div className="mb-4">
							<label className="block">Date d'expiration</label>
							<input type="date" name="expiration_date" value={formData.expiration_date.split('T')[0]} onChange={handleChange} className="input input-bordered w-full" required />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2 ">
						<div className="mb-4">
							<label className="block">Unité</label>
							<input type="text" name="unit" value={formData.unit} onChange={handleChange} className="input input-bordered w-full" required />
						</div>
						<div className="mb-4">
							<label className="block">Prix unitaire</label>
							<input type="number" name="unit_price" value={formData.unit_price} onChange={handleChange} className="input input-bordered w-full" required />
						</div>
					</div>
					<button type="submit" className="flex gap-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 mb-3">
						<FiSave size={24} /> Sauvegarder
					</button>
				</form>
			</div>
		</div>
	);
}


