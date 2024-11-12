import { Category } from "@/types/category";
import { FiSave } from "react-icons/fi";

type ArticleFormProps = {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    formData: {
        article_name: string;
        article_description: string;
        article_quantity: number;
        barcode: string;
        expiration_date: string;
        quantity_min: number;
        unit: string;
        unit_price: number;
        categoryId: number | string | null; // Permet également null
    };
    categories: Category[]; // Liste des catégories
};

export default function ArticleForm({ handleSubmit, handleChange, formData, categories }: ArticleFormProps) {
    return (
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
                <select name="categoryId" value={formData.categoryId || ""}  onChange={handleChange} className="select select-bordered w-full" required>
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
                    <input type="date" name="expiration_date" value={formData.expiration_date} onChange={handleChange} className="input input-bordered w-full" required />
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
    );
}
