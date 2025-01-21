

'use client'
import { useEffect, useState } from "react";
import { createArticle } from "@/services/articleService";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { Category } from "@/types/category";
import Swal from "sweetalert2";
import ArticleForm from "@/components/ArticleForm";

export default function AddArticle() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [formData, setFormData] = useState({
		article_name: "",
		article_description: "",
		barcode: "",
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

		const payload = {
			...formData,
			quantity_min: Number(formData.quantity_min), // Conversion explicite en nombre
			unit_price: Number(formData.unit_price), // Conversion explicite en nombre
			categoryId: Number(formData.categoryId), // Conversion explicite en nombre
		};

		await createArticle(payload);
		router.push('/article');
		Swal.fire({
			html: `L'article <span style="color: red;">${formData.article_name}</span> a été ajouté avec succès !`,
			icon: 'success',
		});

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

				<ArticleForm
					formData={formData}
					categories={categories}
					onChange={handleChange}
					onSubmit={handleSubmit}
				/>
			</div>
		</div>
	);
}


