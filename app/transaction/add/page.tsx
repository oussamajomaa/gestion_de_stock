'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import Select from 'react-select';
import Swal from "sweetalert2";
import { Article } from "@/types/article";

export default function Page() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [formData, setFormData] = useState({
        transaction_type: "",
        transaction_quantity: 0,
        transaction_date: new Date().toISOString().split("T")[0],
        articleId: "" as number | "",
        userId: "" as number | "",
        batch_expiration_date: new Date().toISOString().split("T")[0],  // New field for batch expiration date
    });

    
    const router = useRouter();

    // Fetch articles data
    const fetchArticle = async () => {
        const response = await fetch("/api/article");
        if (response.ok) {
            const data = await response.json();
            setArticles(data);
        } else {
            Swal.fire('Erreur', "Une erreur est survenue lors de l'ajout d'une transaction.", 'error');
        }
    };

    useEffect(() => {
        fetchArticle();
    }, []);

    // Options for Select component
    const articleOptions = articles.map(article => ({
        label: article.article_name,
        value: article.id,
    }));

    const userId = localStorage.getItem('id')
    // Handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (userId) {
            formData.userId = parseInt(userId, 10); // Convertit la chaîne en nombre
        } 

        const response = await fetch('/api/transaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        
        if (!response.ok) {
            Swal.fire('', data.message, 'error');
        } else {
            router.push('/transaction');
            Swal.fire('', data.message, 'success');
        }
    };

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "transaction_quantity" ? parseFloat(value) : value,
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
                <h1 className="text-3xl font-bold mb-3">Ajouter une transaction</h1>

                <form onSubmit={handleSubmit}>
                    {/* Article Selector */}
                    <div className="mb-4">
                        <label className="block">Nom d&apos;article</label>
                        <Select
                            options={articleOptions}
                            onChange={(selectedOption) =>
                                handleChange({
                                    target: {
                                        name: 'articleId',
                                        value: selectedOption ? selectedOption.value : '',
                                    },
                                } as React.ChangeEvent<HTMLInputElement>)
                            }
                            value={articleOptions.find(option => option.value === formData.articleId) || null}
                            placeholder="Rechercher un article"
                            isClearable
                            className="w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">Type de transaction</label>
                        <select name="transaction_type" value={formData.transaction_type} onChange={handleChange} className="select select-bordered w-full" required>
                            <option value="">Sélectionnez un type</option>
                            <option value="Entrée">Entrée</option>
                            <option value="Sortie">Sortie</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block">Quantité</label>
                        <input type="number" name="transaction_quantity" value={formData.transaction_quantity} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                    {/* <div className="mb-4">
                        <label className="block">User</label>
                        <input type="number" name="userId" value={formData.userId || 1} onChange={handleChange} className="input input-bordered w-full" required />
                    </div> */}
                    <div className="mb-4">
                        <label className="block">Date de transaction</label>
                        <input type="date" name="transaction_date" value={formData.transaction_date} onChange={handleChange} className="input input-bordered w-full" />
                    </div>

                    

                    

                    {/* Expiration Date for Batch */}
                    {formData.transaction_type === "Entrée" && (
                        <div className="mb-4">
                            <label className="block">Date d`&apos;expiration du lot</label>
                            <input
                                type="date"
                                name="batch_expiration_date"
                                value={formData.batch_expiration_date}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                    )}

                    <button type="submit" className="flex gap-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 mb-3">
                        <FiSave size={24} /> Sauvegarder
                    </button>
                </form>
            </div>
        </div>
    );
}
