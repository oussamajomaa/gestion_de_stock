import React from 'react'
import { Article } from '@/types/article';
import { FiSave } from "react-icons/fi";
import Select from 'react-select';


type TransactionFormProps = {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    formData: {
        transaction_quantity: number;
        transaction_type: string;
        transaction_date: string;
        articleId: number | string | null;
        userId: number | string | null ;
    };
    articles: Article[]; // Liste des article
};

export default function TransactionForm({ handleSubmit, handleChange, formData, articles }: TransactionFormProps) {
    // Transformer les articles en options pour `react-select`
    const articleOptions = articles.map(article => ({
        label: article.article_name,
        value: article.id,
    }));
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block">Quantité</label>
                <input type="number" name="transaction_quantity" value={formData.transaction_quantity} onChange={handleChange} className="input input-bordered w-full" required />
            </div>
            <div className="mb-4">
                <label className="block">User</label>
                <input type="number" name="userID" value={formData.userId || 1} onChange={handleChange} className="input input-bordered w-full" required />
            </div>
            <div className="mb-4">
                <label className="block">Date de transaction</label>
                <input type='date' name="transaction_date" value={formData.transaction_date} onChange={handleChange} className="textarea textarea-bordered w-full" />
            </div>

            <div className="mb-4">
                <label className="block">Type de transaction</label>
                {/* <input type="text" name="transaction_type" value={formData.transaction_type} onChange={handleChange} className="input input-bordered w-full" required /> */}
                <select name="transaction_type" value={formData.transaction_type} onChange={handleChange} className="select select-bordered w-full" required>
                    <option value="">Sélectionnez un type</option>
                    <option value="Entrée">Entrée</option>
                    <option value="Sortie">Sortie</option>
                </select>
            </div>


            {/* Sélecteur de Catégorie */}
            <div className="mb-4">
                <label className="block">Nom d&apos;article</label>
                <Select
                    options={articleOptions}  // Utilisez les options transformées ici
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


            <button type="submit" className="flex gap-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 mb-3">
                <FiSave size={24} /> Sauvegarder
            </button>
        </form>
    )
}
