'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import TransactionForm from "@/components/TransactionForm";
import { Article } from "@/types/article";
import { FiSave } from "react-icons/fi";
import Select from 'react-select';
import Swal from "sweetalert2";
import { Transaction } from "@/types/transaction";

export default function page() {
    const { id } = useParams()
    const router = useRouter()
    const [articles, setArticles] = useState<Article[]>([]);
    // const [transaction,setTransaction] = useState<Transaction | null>(null)
    const [formData, setFormData] = useState({
        transaction_type: "",
        transaction_quantity: 0,
        transaction_date: new Date().toISOString().split("T")[0],
        article_name:"",
        articleId: "" as number | "",
        userId: "" as number | "",
        // batch_expiration_date: new Date().toISOString().split("T")[0],  // New field for batch expiration date
    });
    const fetchArticle = async () => {
        const response = await fetch("/api/article"); // Remplacez par votre endpoint
        if (response.ok) {
            const data = await response.json();
            setArticles(data);
		} else {
			Swal.fire('Erreur', "Une erreur est survenue lors de l'ajout d'une transaction.", 'error');
		}
    }

    const fetchTransaction = async () => {
        const response = await fetch(`/api/transaction/${id}`)
        if (response.ok) {
            const data = await response.json()
            console.log(data);
            
            setFormData({
                transaction_type: data.transaction_type,
                transaction_quantity: data.transaction_quantity,
                transaction_date: new Date(data.transaction_date).toISOString().split("T")[0],
                article_name: data.batch.article.article_name,
                articleId: data.batch.articleId,
                userId: data.userId,
                // batch_expiration_date: (new Date(data.batch.expiration_date).toISOString().split("T")[0])
            })
        }
    }

    useEffect(() => {
        fetchArticle()
        fetchTransaction()
        console.log(formData);
    }, [])

        // Options for Select component
        const articleOptions = articles.map(article => ({
            label: article.article_name,
            value: article.id,
        }));

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        formData.userId = 1;

        const response = await fetch(`/api/transaction/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const data = await response.json()
        if (response.ok) {
            router.push('/transaction')
            Swal.fire('',data.message,"success");
        } else {
            Swal.fire('',data.message,'error');
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
                <h1 className="text-3xl font-bold mb-3">Éditer une transaction</h1>

                {/* <TransactionForm handleSubmit={handleSubmit} handleChange={handleChange} formData={formData} articles={articles} /> */}
                <form onSubmit={handleSubmit}>
                    {/* Article Selector */}
                    <div className="mb-4">
                        <label className="block">Nom d'article</label>
                        {/* <Select
                            options={articleOptions}
                            onChange={(selectedOption) =>
                                handleChange({
                                    target: {
                                        name: 'articleId',
                                        value: selectedOption ? selectedOption.value : '',
                                    },
                                } as any)
                            }
                            value={articleOptions.find(option => option.value === formData.articleId) || null}
                            placeholder="Rechercher un article"
                            isClearable
                            className="w-full"
                        />
                         */}
                         <input type="text" name="transaction_quantity" value={formData.article_name} disabled className="input input-bordered w-full"  />
                    </div>
                    <div className="mb-4">
                        <label className="block">Type de transaction</label>
                        {/* <select name="transaction_type"  value={formData.transaction_type} onChange={handleChange} className="select select-bordered w-full" required>
                            <option value="">Sélectionnez un type</option>
                            <option value="Entrée">Entrée</option>
                            <option value="Sortie">Sortie</option>
                        </select> */}
                        <input type="text" name="transaction_quantity" value={formData.transaction_type} disabled className="input input-bordered w-full"  />
                    </div>
                    <div className="mb-4">
                        <label className="block">Quantité</label>
                        <input type="number" name="transaction_quantity" value={formData.transaction_quantity} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="mb-4">
                        <label className="block">User</label>
                        <input type="number" name="userId" value={formData.userId || 1} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="mb-4">
                        <label className="block">Date de transaction</label>
                        <input type="date" name="transaction_date" value={formData.transaction_date} onChange={handleChange} className="input input-bordered w-full" />
                    </div>

                    

                    

                    {/* Expiration Date for Batch 
                    {formData.transaction_type === "Entrée" && (
                        <div className="mb-4">
                            <label className="block">Date d'expiration du lot</label>
                            <input
                                type="date"
                                name="batch_expiration_date"
                                value={formData.batch_expiration_date}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                    )}
                    */}
                    <button type="submit" className="flex gap-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 mb-3">
                        <FiSave size={24} /> Sauvegarder
                    </button>
                </form>

            </div>
        </div>
    )
}
